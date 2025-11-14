# TODO: just use master once `feat/stubs` is merged in
git clone --depth 1 --no-checkout --single-branch --branch "feat/stubs" https://github.com/venice-v5/venice

cd venice

git sparse-checkout set stubs

git checkout

cd ..

# actually build the docs
uvx pdoc --search -n -t templates venice/stubs/venice/__init__.py -o output

rm -rf venice
