# TODO: just use master once `feat/stubs` is merged in
git clone --depth 1 --no-checkout --single-branch --branch "feat/stubs" https://github.com/venice-v5/venice; cd venice
git sparse-checkout set venice
git checkout
cd ..
uvx pdoc --search -n -t src/stubs/templates venice/venice/venice/__init__.py -o src/stubs/output
rm -rf venice
