# TODO: just use master once `feat/stubs` is merged in
set -e

git clone --depth 1 --no-checkout --single-branch --branch "feat/stubs" https://github.com/venice-v5/venice; cd venice
git sparse-checkout set venice
git checkout
cd ..
INITIAL=$(pwd)
cd venice/venice/venice

rm -rf "$INITIAL/output"
uvx pdoc --search -n -t templates -o "$INITIAL/output" __init__.py

mv "$INITIAL/output/venice.html" "$INITIAL/output/index.html"
mv "$INITIAL/output/venice/vasyncio.html" "$INITIAL/output/vasyncio.html"
rmdir "$INITIAL/output/venice"

replace_in_file() {
    file="$1"
    expression="$2"
    tmp="$(mktemp)"
    sed "$expression" "$file" > "$tmp"
    mv "$tmp" "$file"
}

replace_in_file "$INITIAL/output/index.html" 's|href="venice/vasyncio\.html"|href="vasyncio.html"|g'
replace_in_file "$INITIAL/output/vasyncio.html" 's|href="\./\.\./venice\.html|href="index.html|g; s|href="\.\./venice\.html|href="index.html|g; s|\.\./search\.js|search.js|g'

cd "$INITIAL"
rm -rf venice
