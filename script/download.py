#!/usr/bin/env python3
"""
Download and extract VNDB database dump from https://dl.vndb.org/dump/vndb-db-latest.tar.zst
"""

import os
import sys
import requests
import tarfile
import zstandard as zstd
import shutil
import glob


def download_file(url: str, output_path: str, chunk_size: int = 8192) -> bool:
    """Download file from URL with progress indication"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()

        total_size = int(response.headers.get("content-length", 0))
        downloaded = 0

        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=chunk_size):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        progress = (downloaded / total_size) * 100
                        print(
                            f"\rDownloading: {progress:.1f}% ({downloaded:,}/{total_size:,} bytes)",
                            end="",
                            flush=True,
                        )

        print("\nDownload completed!")
        return True

    except requests.RequestException as e:
        print(f"Error downloading file: {e}")
        return False
    except IOError as e:
        print(f"Error writing file: {e}")
        return False


def decompress_zst(input_path: str, output_path: str) -> bool:
    """Decompress .zst file"""
    try:
        with open(input_path, "rb") as compressed:
            dctx = zstd.ZstdDecompressor()
            with open(output_path, "wb") as decompressed:
                dctx.copy_stream(compressed, decompressed)

        print(f"Decompressed {input_path} to {output_path}")
        return True

    except Exception as e:
        print(f"Error decompressing file: {e}")
        return False


def extract_tar(tar_path: str, extract_to: str = ".") -> bool:
    """Extract tar file"""
    try:
        with tarfile.open(tar_path, "r") as tar:
            tar.extractall(path=extract_to)

        print(f"Extracted {tar_path} to {extract_to}")
        return True

    except Exception as e:
        print(f"Error extracting tar file: {e}")
        return False


def cleanup_before_download():
    """Clean up all files and directories except .py files and requirements.txt before download"""
    for item in os.listdir("."):
        if item.endswith(".py") or item == "requirements.txt":
            continue

        item_path = os.path.join(".", item)

        try:
            if os.path.isfile(item_path):
                os.remove(item_path)
                print(f"Removed file: {item}")
            elif os.path.isdir(item_path):
                shutil.rmtree(item_path)
                print(f"Removed directory: {item}")
        except OSError as e:
            print(f"Warning: Could not remove {item}: {e}")


def main():
    """Main function to download and extract VNDB database dump"""
    url = "https://dl.vndb.org/dump/vndb-db-latest.tar.zst"
    compressed_file = "vndb-db-latest.tar.zst"
    tar_file = "vndb-db-latest.tar"

    print("Starting VNDB database download and extraction...")

    cleanup_before_download()

    print(f"Downloading from {url}...")
    if not download_file(url, compressed_file):
        sys.exit(1)

    print("Decompressing .zst file...")
    if not decompress_zst(compressed_file, tar_file):
        sys.exit(1)

    print("Extracting tar file...")
    if not extract_tar(tar_file):
        sys.exit(1)

    try:
        os.remove(compressed_file)
        os.remove(tar_file)
        print("Cleaned up temporary files")
    except OSError as e:
        print(f"Warning: Could not clean up temporary files: {e}")

    print("VNDB database download and extraction completed successfully!")


if __name__ == "__main__":
    main()
