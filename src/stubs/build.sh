git clone --depth 1 --no-checkout --single-branch https://github.com/venice-v5/venice
cd venice
git sparse-checkout set venice
git checkout
cd venice/venice
uvx griffe dump . > /tmp/dump.json
cd ../../..
rm -rf venice
