--format for geoJSON
--mike byrne
--need to refine this a little
--make sure it works; there are some issues on the editing style
--------------------------------
--------------------------------
--first lines
--{
--"type": "FeatureCollection",
--"features": [
--------------------------------
--------------------------------
--for each line {"type": "Feature", "id": <GID>,"properties": { },
--------------------------------
--------------------------------
--   ', "geometry": { "type": "Point", "Coordinates": [' || st_x(geom) || ', ' || st_y(geom) || '] }}, '
--------------------------------
--------------------------------
--last lines
--]
--}
--------------------------------
--------------------------------

copy 
( select '{"type": "Feature", "id": '|| gid || ', "properties": {"gid": ' || gid || 
    ', "total": ' || total || ', "teachers_schools": ' || teachers_schools ||
    ', "work_study_jobs": ' || work_study_jobs || ', "head_start": ' || head_start ||
    ', "cleanair_water": ' || cleanair_water || ', "military_readiness": ' || military_readiness ||
    ', "law_enforcement": ' || law_enforcement || ', "job_search_assistance":' || job_search_assistance ||
    ', "child_care": ' || child_care || ', "vaccines_children": ' || vaccines_children ||
    ', "public_health": ' || public_health || ', "stop_violence_against_women": ' || stop_violence_against_women ||
    ', "nutrition_assistance": ' || nutrition_assistance || '} ' ||
    ', "geometry": { "type": "Point", "Coordinates": [' || st_x(geom) || ', ' || st_y(geom) || '] }}, '
  from analysis.state_seq, carto.state_centroids
  where state_seq.state=state_centroids.name_1
  order by name_1 )
  to '/Users/feomike/downloads/state_seq.geojson'












