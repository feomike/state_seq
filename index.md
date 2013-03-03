---
layout: default
title: Example State Sequester
---

###Presenting Data
This page is an example of transforming data into visualizations. It is entirely a work of my own and not in any way associated with my employer.

##Goal
I wanted to test some ideas brewing around a) data as part of the web ecology and b) launching interactive maps and visualizations with no software costs and no hardware costs or infrastructure. As an example this is a useful model for repeating. More to learn here but this is curious.

##Results
- [Data File 1 -geojson](data/state_seq.geojson)
- [Data File 2 (geojson)](state_seq_pct.geojson)
- [MapBox Example Visualization](http://tiles.mapbox.com/feomike/map/map-cjk4bn33#4.00/39.53/-95.41)
- [D3 Example Visualization](http://xqin1.github.com/d3_playground/state_seq.html)

##Background
So Sunday February 25, 2013, the White House released a b[unch of documents detailing projected costs to states of the upcoming sequester. Several news outlets carried the story - [see this washington post article](http://www.washingtonpost.com/business/white-house-releases-state-by-state-breakdown-of-sequesters-effects/2013/02/24/caeb71a0-7ec0-11e2-a350-49866afab584_story.html). However, only [this article by the Huffington Post](http://www.huffingtonpost.com/2013/02/24/sequester-states_n_2755181.html) had links to each individual state document .

Surprised at how these documents had real data, but were presented in pdfs, a colleague ([@LearonDalby]()) and I were discussing how this data could be much better presented. We decided late sunday night to enter the data into a machine readable format, and begin a small project for visualizing the data.

##How we did it
We begin by first looking at each of the pdfs for a repeatable pattern in the document. We decided to enter the data into a google spreadsheet; [this one](https://docs.google.com/spreadsheet/ccc?key=0Aooxb2GcQ9ifdGxoYjNKQW1kSm1rSG5Ba0NtNXFrOWc&usp=sharing) in fact. We listed each state in the first column, and then added columns for each of the areas listed in the pdfs (e.g. Teachers and Schools, Clean Air and Water, Public Health etc). He began reading these numbers, and I typed these numbers into the google doc.

When this was complete, I exported the data to [this csv](data/State-Sequester-20130225.txt), read that into a postgres database. My intent was to make a geojson file of this data, so I joined the data to a table containing state centroids as point geometry and a common state name field as our table. I then used [this sql script](data/export_geoJson.sql) to export the data to geojson. I then created [this gitrepo](https://github.com/feomike/state_seq), turned the repo into a gh-pages branch and bengin committing these files to that repo.

I also engaged another colleage ([@qinxiaoming](https://twitter.com/qinxiaoming)) asking him what he could come up with. Completely on his own time he developed the above example in D3. In parallel I developed the above example in mapbox.
