# Convert a shapefile to a geojson for d3
from json import dumps

import shapefile

infile = "D:/Downloads/cb_2017_us_cd115_20m/cb_2017_us_cd115_20m.shp"
outfile = "D:/Downloads/district_geo.json"
reader = shapefile.Reader(infile)
fields = reader.fields[1:]
field_names = [field[0] for field in fields]
buffer = []
for i, sr in enumerate(reader.shapeRecords()):
    data = dict(zip(field_names, sr.record))
    if data.get('STATEFP') == '39':
        geom = sr.shape.__geo_interface__
        buffer.append(dict(type="Feature", geometry=geom, properties=data))
geojson = open(outfile, "w")
geojson.write(dumps({"type": "FeatureCollection", "features": buffer}))
geojson.close()