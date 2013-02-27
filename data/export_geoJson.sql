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

--make one w/ pct's for all data columns
copy 
( select '{"type": "Feature", "id": '|| gid || ', "properties": {"gid": ' || gid ||
    ', "state": "' || state || '"' || 
    ', "total": ' || total || 
    ', "teachers_schools": "' || to_char(teachers_schools,'FM$999,999,999') || '", "pct_teachers_schools": ' || round(teachers_schools/total*100,2) ||
    ', "work_study_jobs": "' || to_char(work_study_jobs, 'FM$999,999,999') || '", "pct_work_study_jobs": ' || round(work_study_jobs/total*100,2) ||
     ', "head_start": "' || to_char(head_start, 'FM$999,999,999') || '",  "pct_head_start": ' || round(head_start/total*100,2) ||
    ', "cleanair_water": "' || to_char(cleanair_water, 'FM$999,999,999') || '", "pct_cleanair_water": ' || round(cleanair_water/total*100,2) ||  
    ', "military_readiness": "' || to_char(military_readiness, 'FM$999,999,999') || '", "pct_military_readiness": ' || round(military_readiness/total*100,2) ||
    ', "law_enforcement": "' || to_char(law_enforcement, 'FM$999,999,999') || '", "pct_law_enforcement": ' ||  round(law_enforcement/total*100,2) || 
    ', "job_search_assistance": "' || to_char(job_search_assistance, 'FM$999,999,999') || '", "pct_job_search_assistance": ' || round(job_search_assistance/total*100,2) ||
    ', "child_care": "' || to_char(child_care, 'FM$999,999,999') || '", "pct_child_care": ' || round(child_care/total*100,2) || 
    ', "vaccines_children": "' || to_char(vaccines_children, 'FM$999,999,999') || '", "pct_vaccines_children": ' || round(vaccines_children/total*100,2) ||
    ', "public_health": "' || to_char(public_health, 'FM$999,999,999') || '", "pct_public_health": ' || round(public_health/total*100,2) || 
    ', "stop_violence_against_women": "' || to_char(stop_violence_against_women, 'FM$999,999,999') || '", "pct_stop_violence_against_women": ' || round(stop_violence_against_women/total*100,2) ||
    ', "nutrition_assistance": "' || to_char(nutrition_assistance, 'FM$999,999,999') || '", "pct_nutrition_assistance": ' || round(nutrition_assistance/total*100,2) || 
    '} ' ||
    ', "geometry": { "type": "Point", "Coordinates": [' || st_x(geom) || ', ' || st_y(geom) || '] }}, '
  from analysis.state_seq, carto.state_centroids
  where state_seq.state=state_centroids.name_1
  order by name_1 )
  to '/Users/feomike/downloads/state_seq.geojson';

--make one w/ pct's for only big three, and then sum the others
copy 
( select '{"type": "Feature", "id": '|| gid || ', "properties": {"gid": ' || gid ||
    ', "state": "' || state || '"' || 
    ', "total": ' || total || 
    ', "teachers_schools": "' || to_char(teachers_schools,'FM$999,999,999') || '", "pct_teachers_schools": ' || round(teachers_schools/total*100,2) ||
    ', "cleanair_water": "' || to_char(cleanair_water, 'FM$999,999,999') || '", "pct_cleanair_water": ' || round(cleanair_water/total*100,2) ||  
    ', "military_readiness": "' || to_char(military_readiness, 'FM$999,999,999') || '", "pct_military_readiness": ' || round(military_readiness/total*100,2) ||
    ', "all_other_money": "' || to_char(law_enforcement + job_search_assistance + vaccines_children + public_health + stop_violence_against_women + nutrition_assistance, 'FM$999,999,999') || '"' ||
    ', "pct_all_other_money": ' || round(law_enforcement + job_search_assistance + vaccines_children + public_health + stop_violence_against_women + nutrition_assistance/total*100,2) ||
    '} ' ||
    ', "geometry": { "type": "Point", "Coordinates": [' || st_x(geom) || ', ' || st_y(geom) || '] }}, '
  from analysis.state_seq, carto.state_centroids
  where state_seq.state=state_centroids.name_1
  order by name_1 )
  to '/Users/feomike/downloads/state_seq_pct.geojson'


