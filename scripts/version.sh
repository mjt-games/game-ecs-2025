#!/bin/bash

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version>"
  exit 1
fi


echo "Updating version to $VERSION"

# Update the version in package.json
# sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json

# Commit the version change
# git add package.json
# git commit -m "Update version to $VERSION"

# Tag the commit with the version

echo "🏷️ Tagging as '$VERSION'..."
git tag "$VERSION"
git remote | xargs -I {} git push {} --tags
# git remote | xargs -I {} git push {} --all
