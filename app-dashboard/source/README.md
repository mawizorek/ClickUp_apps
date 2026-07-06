# app-dashboard / source

Staging + modular source for the App Dashboard.

**Right now:** drop the File Chunker output here (the sub-30KB chunks + the markdown index of the current `../index.html`). Brain reads the indexed chunk set whole, reconstructs the full file, then rebuilds this folder into proper concern-separated modules (styles, data/meta, render, engine) behind a slim `../index.html` loader.

Once the modular split lands, this README documents the module map.
