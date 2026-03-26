# TODO: just use master once `feat/stubs` is merged in
git clone --depth 1 --no-checkout --single-branch --branch "feat/stubs" https://github.com/venice-v5/venice; cd venice
git sparse-checkout set venice
git checkout
cd venice/venice
uvx griffe dump . > /tmp/dump.json
cd ../../..
rm -rf venice
