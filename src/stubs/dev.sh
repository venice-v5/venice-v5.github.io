STUB_PATH='/Users/aadish/Developer/active/venice/venice/venice/__init__.py'
SITE_PATH='/Users/aadish/Developer/gh/venice-v5.github.io'
bunx concurrently "uvx watchfiles 'uvx pdoc --search -n -t templates \"$STUB_PATH\" -o output' \"$STUB_PATH\"" "cd $SITE_PATH && bun dev"
