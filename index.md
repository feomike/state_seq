---
layout: default
title: Example State Sequester
catch: This page is an example of transforming data into visualizations. It is entirely a work of my own and not in any way associated with my employer.
---
##Goal
I wanted to test some ideas brewing around

1. data as part of the web ecology and
2. launching interactive maps and visualizations with no software costs and no hardware costs or infrastructure.

As an example this is a useful model for repeating. More to learn here but this is curious.

##Background
On Sunday, February 25, 2013, the White House released documents detailing the projected costs to states of the upcoming sequester. Several news outlets carried the story - see [this Washington Post article](http://www.washingtonpost.com/business/white-house-releases-state-by-state-breakdown-of-sequesters-effects/2013/02/24/caeb71a0-7ec0-11e2-a350-49866afab584_story.html). However, only [the Huffington Post](http://www.huffingtonpost.com/2013/02/24/sequester-states_n_2755181.html) had links to each individual state document.

Surprised at how these documents had real data, but were presented in pdfs, a colleague, [@LearonDalby](https://twitter.com/LearonDalby), and I were discussing how this data could be much better presented. We decided late Sunday night to enter the data into a machine readable format and begin a small project for visualizing the data.

##How We Did It
We began by first looking at each of the pdfs for a repeatable pattern in the data. We decided to enter the data into a [Google Spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0Aooxb2GcQ9ifdGxoYjNKQW1kSm1rSG5Ba0NtNXFrOWc&usp=sharing). My colleague began reading these numbers as I typed them into the Google Spreadsheet. We listed each state in the first column, and then added columns for each of the areas listed in the pdfs (e.g. Teachers and Schools, Clean Air and Water, Public Health, etc).

When this was complete, I exported the data to [this csv](data/State-Sequester-20130225.txt) and read that into a PostgreSQL database. My intent was to make a geojson file of this data, so I joined the data to a table containing state centroids as point geometry and a common state name field in our table. I then used [this sql script](data/export_geoJson.sql) to export the data to geojson. I then created [this gitrepo](https://github.com/feomike/state_seq), turned the repo into a gh-pages branch and began committing these files.

I also engaged another colleague, [@qinxiaoming](https://twitter.com/qinxiaoming), asking him what he could come up with. Completely on his own time he developed the above example in [D3](http://d3js.org/). In parallel I developed the above example in [Mapbox](http://mapbox.com/).

##Results

####Data
- [Data File 1 - geojson](data/state_seq.geojson)
- [Data File 2 - geojson](data/state_seq_pct.geojson)

####Visualizations
- [MapBox Example Visualization](http://tiles.mapbox.com/feomike/map/map-cjk4bn33#4.00/39.53/-95.41)
- [D3 Example Visualization](http://xqin1.github.com/d3_playground/state_seq.html)

##Costs

####Software
- Storing the original data (Google Docs) - $0
- Storing, formatting and joining geoData (PostGIS) - $0
- Exporting to geojson (Postgres) - $0
- Visualization with javascript (D3) - $0
- Visualization with map cartography (TileMill) - $0
- Versioning, governance, issue tracking, history, code sharing, collaboration and general awesomeness (GitHub) - $0

####Hardware
- Hosting map tiles (MapBox) - $0
- Web hosting (GitHub) - $0

####Total
- **$0 spent thanks to open source software and free web hosting**

##Conclusion
I think there is a repeatable process here that people should know about.
