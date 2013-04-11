state_seq 
=========

state_sequester
##Example State Sequester Numbers


##Presenting Data
This page is an example of transforming data into visualizations. It is entirely a work of my own and not in any way associated with my employer.

##Goal
I wanted to test some ideas brewing around a) data as part of the web ecology and b) launching interactive maps and visualizations with no software costs and no hardware costs or infrastructure. As an example this is a useful model for repeating. More to learn here but this is curious.

##Results
- Data File 1 (geojson)
- Data File 2 (geojson)
- MapBox Example Visualization
- D3 Example Visualization

##Background
So Sunday February 25, 2013, the White House released a bunch of documents detailing projected costs to states of the upcoming sequester. Several news outlets carried the story - see this washington post article. However, only this article by the Huffington Post had links to each individual state document .

Surprised at how these documents had real data, but were presented in pdfs, a colleague (@LearonDalby) and I were discussing how this data could be much better presented. We decided late sunday night to enter the data into a machine readable format, and begin a small project for visualizing the data.

##How we did it
We begin by first looking at each of the pdfs for a repeatable pattern in the document. We decided to enter the data into a google spreadsheet; this one in fact. We listed each state in the first column, and then added columns for each of the areas listed in the pdfs (e.g. Teachers and Schools, Clean Air and Water, Public Health etc). He began reading these numbers, and I typed these numbers into the google doc.

When this was complete, I exported the data to this csv, read that into a postgres database. My intent was to make a geojson file of this data, so I joined the data to a table containing state centroids as point geometry and a common state name field as our table. I then used this sql script to export the data to geojson. I then created this gitrepo, turned the repo into a gh-pages branch and bengin committing these files to that repo.

I also engaged another colleage (@qinxiaoming) asking him what he could come up with. Completely on his own time he developed the above example in D3. In parallel I developed the above example in mapbox.
