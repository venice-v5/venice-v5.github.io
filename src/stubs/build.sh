# TODO: just use master once `feat/stubs` is merged in
git clone --depth 1 --no-checkout --single-branch --branch "feat/stubs" https://github.com/venice-v5/venice; cd venice
git sparse-checkout set venice
git checkout
cd ..
if command -v uvx >/dev/null 2>&1; then uvx pdoc --search -n -t templates venice/venice/venice/__init__.py -o output; else pip install pdoc && pdoc --search -n -t templates venice/venice/venice/__init__.py -o output; fi
rm -rf venice
