# osm-miniplanets-util

## Usage

```bash
docker build -t osm-miniplanets-util:latest .
```

```bash
docker run --rm -u `(id -u)`:`(id -g)` -v $(pwd):/data osm-miniplanets-util:latest extract-all -i /data/storage/planet-250714.osm.pbf -o /data/output
```