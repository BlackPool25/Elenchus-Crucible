#!/usr/bin/env python3
"""
Paper Research Utility for Elenchus & Crucible
Downloads academic papers from arXiv, extracts text and markdown using PyMuPDF,
and saves them to local scratch or research directories.

Usage:
  python3 download_paper.py 2307.03172
  python3 download_paper.py 2307.03172 --output /path/to/paper.md
  python3 download_paper.py --search "systematic literature review software engineering" --max 3
"""

import argparse
import os
import shutil
import subprocess
import sys
import urllib.request

# Self-healing: arxiv/pymupdf are only required for actual download/search work,
# so --help stays offline-safe. Call ensure_deps() before any network action.
def ensure_deps():
    global arxiv, pymupdf
    try:
        import arxiv as _arxiv
        import pymupdf as _pymupdf
    except ImportError:
        uv_bin = shutil.which("uv") or os.path.expanduser("~/.local/bin/uv")
        if os.path.exists(uv_bin) and not os.environ.get("_ELENCHUS_UV_REEXEC"):
            os.environ["_ELENCHUS_UV_REEXEC"] = "1"
            cmd = [uv_bin, "run", "--with", "arxiv", "--with", "pymupdf", sys.executable, __file__] + sys.argv[1:]
            try:
                res = subprocess.run(cmd)
                sys.exit(res.returncode)
            except Exception as e:
                print(f"[!] Attempted re-exec via uv failed: {e}", file=sys.stderr)
        print("[!] 'arxiv' or 'pymupdf' not installed.", file=sys.stderr)
        print("    Install them via: uv pip install arxiv pymupdf (or pip install arxiv pymupdf)", file=sys.stderr)
        sys.exit(1)
    else:
        arxiv, pymupdf = _arxiv, _pymupdf


def download_and_extract_paper(arxiv_id: str, output_path: str = None) -> str:
    """Download an arXiv paper by ID and extract its full text into markdown."""
    ensure_deps()
    clean_id = arxiv_id.strip()
    if clean_id.startswith("http"):
        parts = clean_id.split("/")
        clean_id = parts[-1].replace(".pdf", "")
        if "abs" in parts or "pdf" in parts:
            clean_id = parts[-1].replace(".pdf", "")

    print(f"[*] Querying arXiv API for ID: {clean_id}...")
    client = arxiv.Client()
    search = arxiv.Search(id_list=[clean_id])
    paper = next(client.results(search), None)

    if not paper:
        print(f"[-] Paper with ID '{clean_id}' not found on arXiv.", file=sys.stderr)
        return None

    print(f"[+] Found: {paper.title}")
    print(f"    Authors: {', '.join(a.name for a in paper.authors[:4])}")
    print(f"    Published: {paper.published}")
    print(f"    PDF URL: {paper.pdf_url}")

    temp_pdf = f"/tmp/arxiv_{clean_id.replace('/', '_')}.pdf"
    if not os.path.exists(temp_pdf):
        print(f"[*] Downloading PDF from {paper.pdf_url}...")
        headers = {"User-Agent": "Mozilla/5.0 (Elenchus-Crucible-Researcher/1.0)"}
        req = urllib.request.Request(paper.pdf_url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(temp_pdf, "wb") as f:
            f.write(resp.read())
        print(f"[+] Downloaded: {os.path.getsize(temp_pdf):,} bytes")
    else:
        print(f"[*] Using cached PDF at {temp_pdf}")

    print("[*] Extracting text with PyMuPDF...")
    doc = pymupdf.open(temp_pdf)
    content = []
    content.append(f"# {paper.title}\n\n")
    content.append(f"- **Authors:** {', '.join(a.name for a in paper.authors)}\n")
    content.append(f"- **Published:** {paper.published}\n")
    content.append(f"- **arXiv ID:** `{clean_id}`\n")
    content.append(f"- **Primary Category:** {paper.primary_category}\n")
    content.append(f"- **URL:** {paper.entry_id}\n\n")
    content.append(f"## Abstract\n\n{paper.summary}\n\n")
    content.append("## Full Text Content\n\n---\n")

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        content.append(f"\n### Page {page_idx + 1}\n\n")
        content.append(page.get_text())

    full_text = "".join(content)

    if not output_path:
        slug = "".join(c if c.isalnum() or c in "-_" else "_" for c in paper.title.lower())[:50]
        output_path = f"/tmp/{clean_id}_{slug}.md"

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"[+] Successfully extracted {len(full_text):,} characters to: {output_path}")
    return output_path


def search_papers(query: str, max_results: int = 5):
    """Search arXiv for papers matching a query."""
    ensure_deps()
    print(f"[*] Searching arXiv for: '{query}' (limit: {max_results})...")
    client = arxiv.Client()
    search = arxiv.Search(query=query, max_results=max_results, sort_by=arxiv.SortCriterion.Relevance)
    
    results = list(client.results(search))
    if not results:
        print("[-] No matching papers found.")
        return []

    print(f"\n[+] Found {len(results)} paper(s):")
    for idx, paper in enumerate(results, 1):
        print(f"\n{idx}. {paper.title}")
        print(f"   ID: {paper.get_short_id()} | Published: {paper.published.strftime('%Y-%m-%d')}")
        print(f"   Authors: {', '.join(a.name for a in paper.authors[:3])}")
        print(f"   Summary: {paper.summary[:200]}...")
    return results


def main():
    parser = argparse.ArgumentParser(description="Download and extract arXiv papers for Elenchus & Crucible research.")
    parser.add_argument("arxiv_id", nargs="?", help="arXiv ID or URL to download and extract (e.g., 2307.03172)")
    parser.add_argument("--output", "-o", help="Custom output path for extracted markdown file")
    parser.add_argument("--search", "-s", help="Search query to find papers on arXiv")
    parser.add_argument("--max", "-m", type=int, default=5, help="Max results for search (default: 5)")

    args = parser.parse_args()

    if args.search:
        search_papers(args.search, args.max)
    elif args.arxiv_id:
        download_and_extract_paper(args.arxiv_id, args.output)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
