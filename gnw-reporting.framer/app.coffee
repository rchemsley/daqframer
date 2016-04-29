{ViewNavigationController} = require "ViewNavigationController"

bg = new BackgroundLayer

vnc = new ViewNavigationController

# This is optional, but allows you to customize the transition
vnc.animationOptions =
	curve: "ease-in-out"
	time: 0.3

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #
viewReporting = new Layer
	name: "initialView"
	width: Screen.width, height: Screen.height
	superLayer: vnc

viewGeneral = new Layer
	width: Screen.width, height: 1334
	image: "images/screen_02_general.png"
	superLayer: vnc

viewSiri = new Layer
	width: Screen.width, height: 1334
	image: "images/screen_03_siri.png"
	superLayer: vnc
	
viewUpdate = new Layer
	width: Screen.width, height: 1334
	image: "images/screen_04_update.png"
	superLayer: vnc

# To remove the back button from a view, do this:
# viewUpdate.backButton = false

# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral = new Layer
	width: Screen.width
	height: 88
	y: 1130
	backgroundColor: "transparent"
	superLayer: viewReporting
	
btnSiri = new Layer
	width: Screen.width
	height: 88
	y: 444
	backgroundColor: "transparent"
	superLayer: viewGeneral
	
btnUpdate = new Layer
	width: Screen.width
	height: 88
	y: 284
	backgroundColor: "transparent"
	superLayer: viewGeneral


# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
btnGeneral.on Events.Click, ->
	vnc.transition viewGeneral
	
btnSiri.on Events.Click, ->
	vnc.transition viewSiri

btnUpdate.on Events.Click, ->
	vnc.transition viewUpdate
	
# To change the direction of the transition, just add a transition property.
# "up", "down", "left" and "right" are the only built-in transitions available.
# Example:
# btnUpdate.on Events.Click, ->
# 	vnc.transition viewUpdate, direction = "up"

# # # # # # # # # # # # # # # # # # # # # # # #
# STICKY HEADER
# # # # # # # # # # # # # # # # # # # # # # # #


reporting_header = new Layer
	width: Screen.width
	height: 147
	y: 79
	image: "images/reporting-header.jpg"
	x: 0
	superLayer: viewReporting


scroll = new ScrollComponent
	width: Screen.width, height: 2000 
	scrollHorizontal: false
	backgroundColor: "rgba(255,255,255,0)"
	y: 226
	superLayer: viewReporting
scroll.contentInset =
    top: 0
    right: 0
    bottom: 10
    left: 0

reporting_screen = new Layer
	width: 1241
	height: 4253
	image: "images/reporting-screen.jpg"
	superLayer: scroll.content

page = new PageComponent
    width: 1187
    height: 561
    y: 1571
    x: 28
    superLayer: scroll.content
page.on "change:currentPage", ->
    page.previousPage.animate
        properties:
            opacity: 0.2
            scale: 0.6
        time: 0.2
 
    page.currentPage.animate
        properties:
            opacity: 1
            scale: 1
        time: 0.2

 
# Create page layers 
layerA = new Layer
    width: 1187
    height: 561
    image: "images/twitter.png"
    superLayer: page.content

layerB = new Layer
    width: 1187
    height: 561
    image: "images/fbshares.png"
    x: 1197
    superLayer: page.content

layerC = new Layer
    width: 1187
    height: 561
    image: "images/likes.png"
    x: 2394
    superLayer: page.content

layerD = new Layer
    width: 1187
    height: 561
    image: "images/retweets.png"
    x: 3591
    superLayer: page.content

indicators = new Layer
	y: 2160
	x: Align.center
	width: 200
	superLayer: scroll.content
	backgroundColor: "rgba(123,123,123,0)"

for i in [0...4]
	indicator = new Layer
		superLayer: indicators
		x: Align.center
		backgroundColor: "rgba(196,196,198,1)"
		borderRadius: 15
		width: 25, height: 25, borderWidth: 0, borderColor: "rgba(75,75,75,1)", shadowSpread: 0, shadowColor: "rgba(94,94,94,0.68)"
	indicator.x = (indicator.width+40) *i

status_header = new Layer
	width: 1244
	height: 78
	image: "images/status-header.jpg"

reporting_headerA = new Layer
	width: 1244
	height: 142
	y: 78
	image: "images/reporting-header.jpg"
	superLayer: viewReporting






