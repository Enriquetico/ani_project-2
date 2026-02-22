#!/usr/bin/env python3
import argparse
import json
import os
import re
import unicodedata
from pathlib import Path
from PIL import Image


def slugify(text: str) -> str:
    normalized = unicodedata.normalize('NFKD', text)
    ascii_text = normalized.encode('ascii', 'ignore').decode('ascii')
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r'[^a-z0-9]+', '-', ascii_text)
    ascii_text = re.sub(r'-{2,}', '-', ascii_text).strip('-')
    return ascii_text or 'imagen'


def unique_name(dest_dir: Path, base_slug: str) -> str:
    candidate = f"{base_slug}.webp"
    index = 2
    while (dest_dir / candidate).exists():
        candidate = f"{base_slug}-{index}.webp"
        index += 1
    return candidate


def process_images(
    source_dir: Path,
    output_dir: Path,
    max_size: int,
    target_size: int,
    quality: int,
    process_webp: bool,
    map_file: Path,
    dry_run: bool,
    overwrite: bool,
) -> None:
    if not source_dir.is_dir():
        raise SystemExit(f"ERROR: no existe el directorio de origen: {source_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)

    processed = 0
    skipped = 0
    errors = 0
    mapping: list[dict[str, str]] = []
    error_details: list[str] = []

    for root, _, files in os.walk(source_dir):
        root_path = Path(root)
        rel_dir = root_path.relative_to(source_dir)
        dest_dir = output_dir / rel_dir
        dest_dir.mkdir(parents=True, exist_ok=True)

        for file_name in files:
            src_path = root_path / file_name
            ext = src_path.suffix.lower()

            if not process_webp and ext == '.webp':
                continue

            base_slug = slugify(src_path.stem)
            out_name = unique_name(dest_dir, base_slug)
            out_path = dest_dir / out_name

            if out_path.exists() and not overwrite:
                rel_out = out_path.relative_to(output_dir).as_posix()
                print(f"[SKIP] {rel_out} ya existe (usa --overwrite para reemplazar)")
                skipped += 1
                continue

            try:
                rel_src = src_path.relative_to(source_dir).as_posix()
                rel_out = out_path.relative_to(output_dir).as_posix()

                if dry_run:
                    mapping.append(
                        {
                            'original_relpath': rel_src,
                            'optimized_relpath': rel_out,
                            'optimized_filename': out_name,
                            'status': 'planned',
                        }
                    )
                    print(f"[DRY] {rel_src} -> {rel_out}")
                    processed += 1
                    continue

                with Image.open(src_path) as image:
                    if image.mode not in ('RGB', 'RGBA'):
                        image = image.convert('RGBA')

                    if target_size > 0:
                        normalized = image.copy()
                        normalized.thumbnail((target_size, target_size), Image.Resampling.LANCZOS)

                        canvas = Image.new('RGBA', (target_size, target_size), (255, 255, 255, 0))
                        offset_x = (target_size - normalized.width) // 2
                        offset_y = (target_size - normalized.height) // 2
                        canvas.paste(normalized, (offset_x, offset_y))
                        image_to_save = canvas
                    else:
                        image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                        image_to_save = image

                    image_to_save.save(out_path, 'WEBP', quality=quality, method=6)

                size_kb = out_path.stat().st_size / 1024

                mapping.append(
                    {
                        'original_relpath': rel_src,
                        'optimized_relpath': rel_out,
                        'optimized_filename': out_name,
                        'status': 'written',
                    }
                )

                print(f"[OK] {rel_src} -> {rel_out} ({size_kb:.1f} KB)")
                processed += 1
            except Exception as exc:
                rel_src = src_path.relative_to(source_dir).as_posix()
                print(f"[ERROR] {rel_src}: {exc}")
                error_details.append(f"{rel_src}: {exc}")
                errors += 1

    unsupported_format = any(
        'cannot identify image file' in detail.lower() for detail in error_details
    )

    result = {
        'source_dir': str(source_dir),
        'output_dir': str(output_dir),
        'processed': processed,
        'skipped': skipped,
        'errors': errors,
        'unsupported_format': unsupported_format,
        'error_details': error_details,
        'dry_run': dry_run,
        'items': mapping,
    }

    map_file.parent.mkdir(parents=True, exist_ok=True)
    map_file.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')

    print('\n--- Proceso terminado ---')
    print(f"Imágenes procesadas: {processed}")
    print(f"Saltadas: {skipped}")
    print(f"Errores: {errors}")
    print(f"Mapa generado: {map_file}")


def main() -> None:
    parser = argparse.ArgumentParser(description='Optimiza imágenes a WebP con nombres SEO y mapa JSON.')
    parser.add_argument('--source', required=True, help='Directorio origen (acepta subcarpetas).')
    parser.add_argument('--output', required=True, help='Directorio destino para imágenes optimizadas.')
    parser.add_argument('--max-size', type=int, default=1024, help='Límite máximo de ancho/alto.')
    parser.add_argument(
        '--target-size',
        type=int,
        default=0,
        help='Si es mayor a 0, fuerza salida cuadrada exacta (ej. 300 => 300x300).',
    )
    parser.add_argument('--quality', type=int, default=80, help='Calidad WebP (1-100).')
    parser.add_argument(
        '--process-webp',
        action='store_true',
        help='Si se define, también procesa .webp existentes.',
    )
    parser.add_argument(
        '--map-file',
        default='scripts/mapa-nombres.json',
        help='Ruta del JSON de trazabilidad original->optimizado.',
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Simula cambios sin escribir imágenes; solo genera el plan en el mapa JSON.',
    )
    parser.add_argument(
        '--overwrite',
        action='store_true',
        help='Permite sobrescribir archivos ya existentes en el destino.',
    )

    args = parser.parse_args()

    quality = max(1, min(100, args.quality))
    process_images(
        source_dir=Path(args.source).expanduser().resolve(),
        output_dir=Path(args.output).expanduser().resolve(),
        max_size=max(64, args.max_size),
        target_size=max(0, args.target_size),
        quality=quality,
        process_webp=args.process_webp,
        map_file=Path(args.map_file).expanduser().resolve(),
        dry_run=args.dry_run,
        overwrite=args.overwrite,
    )


if __name__ == '__main__':
    main()
