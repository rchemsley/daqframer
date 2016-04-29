require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.animationOptions = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode != null ? this.options.debugMode : DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      var i, len, ref, results, subLayer;
      ref = changeList.added;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        results.push(this.addView(subLayer, true));
      }
      return results;
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit(Events.Change);
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, preventHistory, switchInstant;
    this.transition(this._getLastHistoryItem(), direction = DIR.LEFT, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  return ViewNavigationController;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmljaGVtL0Rlc2t0b3AvUHJvamVjdHMvRnJhbWVyIFRlc3Qvdm5jLWV4YW1wbGUwMS5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7O0FBQU0sT0FBTyxDQUFDO0FBR2IsTUFBQTs7OztFQUFBLGlCQUFBLEdBQW9COztFQUNwQixvQkFBQSxHQUF1Qjs7RUFDdkIsaUJBQUEsR0FDQztJQUFBLElBQUEsRUFBTSxHQUFOO0lBQ0EsS0FBQSxFQUFPLGFBRFA7OztFQUVELGlCQUFBLEdBQ0M7SUFBQSxDQUFBLEVBQUcsQ0FBSDtJQUNBLENBQUEsRUFBRyxFQURIO0lBRUEsS0FBQSxFQUFPLEVBRlA7SUFHQSxNQUFBLEVBQVEsRUFIUjs7O0VBSUQsSUFBQSxHQUNDO0lBQUEsRUFBQSxFQUFRLFFBQVI7SUFDQSxJQUFBLEVBQVEsVUFEUjtJQUVBLElBQUEsRUFBUSxVQUZSO0lBR0EsS0FBQSxFQUFRLFdBSFI7SUFJQSxNQUFBLEVBQVEsWUFKUjs7O0VBS0QsR0FBQSxHQUNDO0lBQUEsRUFBQSxFQUFPLElBQVA7SUFDQSxJQUFBLEVBQU8sTUFEUDtJQUVBLElBQUEsRUFBTyxNQUZQO0lBR0EsS0FBQSxFQUFPLE9BSFA7OztFQUlELFVBQUEsR0FBYTs7RUFHQSxrQ0FBQyxPQUFEO0FBRVosUUFBQTtJQUZhLElBQUMsQ0FBQSw0QkFBRCxVQUFTO0lBRXRCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxlQUFELEdBQW1COztVQUNqRyxDQUFD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RUFEUDtZQUVBLE1BQUEsRUFBUSxFQUZSO1lBR0EsVUFBQSxFQUFZLElBSFo7V0FEZ0I7VUFNakIsSUFBRyxLQUFDLENBQUEsU0FBRCxLQUFjLEtBQWpCO1lBQ0MsVUFBVSxDQUFDLGVBQVgsR0FBNkIsY0FEOUI7O1VBR0EsVUFBVSxDQUFDLEtBQVgsR0FBbUI7aUJBRW5CLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBTSxDQUFDLEtBQXJCLEVBQTRCLFNBQUE7bUJBQzNCLEtBQUMsQ0FBQSxJQUFELENBQUE7VUFEMkIsQ0FBNUIsRUFaRDs7TUFEYztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtFQURpQjs7OztHQXZJNEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXG5cdCMgU2V0dXAgQ2xhc3MgQ29uc3RhbnRzXG5cdElOSVRJQUxfVklFV19OQU1FID0gXCJpbml0aWFsVmlld1wiXG5cdEJBQ0tCVVRUT05fVklFV19OQU1FID0gXCJ2bmMtYmFja0J1dHRvblwiXG5cdEFOSU1BVElPTl9PUFRJT05TID0gXG5cdFx0dGltZTogMC4zXG5cdFx0Y3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuXHRCQUNLX0JVVFRPTl9GUkFNRSA9IFxuXHRcdHg6IDBcblx0XHR5OiA0MFxuXHRcdHdpZHRoOiA4OFxuXHRcdGhlaWdodDogODhcblx0UFVTSCA9XG5cdFx0VVA6ICAgICBcInB1c2hVcFwiXG5cdFx0RE9XTjogICBcInB1c2hEb3duXCJcblx0XHRMRUZUOiAgIFwicHVzaExlZnRcIlxuXHRcdFJJR0hUOiAgXCJwdXNoUmlnaHRcIlxuXHRcdENFTlRFUjogXCJwdXNoQ2VudGVyXCJcblx0RElSID1cblx0XHRVUDogICAgXCJ1cFwiXG5cdFx0RE9XTjogIFwiZG93blwiXG5cdFx0TEVGVDogIFwibGVmdFwiXG5cdFx0UklHSFQ6IFwicmlnaHRcIlxuXHRERUJVR19NT0RFID0gZmFsc2Vcblx0XHRcblx0IyBTZXR1cCBJbnN0YW5jZSBhbmQgSW5zdGFuY2UgVmFyaWFibGVzXHRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblxuXHRcdEB2aWV3cyA9IEBoaXN0b3J5ID0gQGluaXRpYWxWaWV3ID0gQGN1cnJlbnRWaWV3ID0gQHByZXZpb3VzVmlldyA9IEBhbmltYXRpb25PcHRpb25zID0gQGluaXRpYWxWaWV3TmFtZSA9IG51bGxcblx0XHRAb3B0aW9ucy53aWR0aCAgICAgICAgICAgPz0gU2NyZWVuLndpZHRoXG5cdFx0QG9wdGlvbnMuaGVpZ2h0ICAgICAgICAgID89IFNjcmVlbi5oZWlnaHRcblx0XHRAb3B0aW9ucy5jbGlwICAgICAgICAgICAgPz0gdHJ1ZVxuXHRcdEBvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcIiM5OTlcIlxuXHRcdFxuXHRcdHN1cGVyIEBvcHRpb25zXG5cdFx0XG5cdFx0QHZpZXdzICAgPSBbXVxuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAYW5pbWF0aW9uT3B0aW9ucyA9IEBvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgb3IgQU5JTUFUSU9OX09QVElPTlNcblx0XHRAaW5pdGlhbFZpZXdOYW1lICA9IEBvcHRpb25zLmluaXRpYWxWaWV3TmFtZSAgb3IgSU5JVElBTF9WSUVXX05BTUVcblx0XHRAYmFja0J1dHRvbkZyYW1lICA9IEBvcHRpb25zLmJhY2tCdXR0b25GcmFtZSAgb3IgQkFDS19CVVRUT05fRlJBTUVcblxuXHRcdEBkZWJ1Z01vZGUgPSBpZiBAb3B0aW9ucy5kZWJ1Z01vZGU/IHRoZW4gQG9wdGlvbnMuZGVidWdNb2RlIGVsc2UgREVCVUdfTU9ERVxuXHRcdFxuXHRcdEAub24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0QGFkZFZpZXcgc3ViTGF5ZXIsIHRydWUgZm9yIHN1YkxheWVyIGluIGNoYW5nZUxpc3QuYWRkZWRcblxuXHRhZGRWaWV3OiAodmlldywgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudCkgLT5cblx0XHRcblx0XHR2bmNXaWR0aCAgPSBAb3B0aW9ucy53aWR0aFxuXHRcdHZuY0hlaWdodCA9IEBvcHRpb25zLmhlaWdodFxuXG5cdFx0dmlldy5zdGF0ZXMuYWRkKFxuXHRcdFx0XCIjeyBQVVNILlVQIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAtdm5jSGVpZ2h0XG5cdFx0XHRcIiN7IFBVU0guTEVGVCB9XCI6XG5cdFx0XHRcdHg6IC12bmNXaWR0aFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guQ0VOVEVSIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guUklHSFQgfVwiOlxuXHRcdFx0XHR4OiB2bmNXaWR0aFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guRE9XTiB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogdm5jSGVpZ2h0XG5cdFx0KVxuXG5cdFx0XHRcblx0XHR2aWV3LnN0YXRlcy5hbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcblx0XHRpZiB2aWV3Lm5hbWUgaXMgQGluaXRpYWxWaWV3TmFtZVxuXHRcdFx0QGluaXRpYWxWaWV3ID0gdmlld1xuXHRcdFx0QGN1cnJlbnRWaWV3ID0gdmlld1xuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkNFTlRFUlxuXHRcdFx0QGhpc3RvcnkucHVzaCB2aWV3XG5cdFx0ZWxzZVxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILlJJR0hUXG5cdFx0XG5cdFx0dW5sZXNzIHZpZXcuc3VwZXJMYXllciBpcyBAIG9yIHZpYUludGVybmFsQ2hhbmdlRXZlbnRcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHRcdFxuXHRcdEBfYXBwbHlCYWNrQnV0dG9uIHZpZXcgdW5sZXNzIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRcblx0XHRAdmlld3MucHVzaCB2aWV3XG5cblx0dHJhbnNpdGlvbjogKHZpZXcsIGRpcmVjdGlvbiA9IERJUi5SSUdIVCwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IGZhbHNlKSAtPlxuXG5cdFx0cmV0dXJuIGZhbHNlIGlmIHZpZXcgaXMgQGN1cnJlbnRWaWV3XG5cdFx0XG5cdFx0IyBTZXR1cCBWaWV3cyBmb3IgdGhlIHRyYW5zaXRpb25cblx0XHRcblx0XHRpZiBkaXJlY3Rpb24gaXMgRElSLlJJR0hUXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILlJJR0hUXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkxFRlRcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuRE9XTlxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5ET1dOXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILlVQXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLkxFRlRcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guTEVGVFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5SSUdIVFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5VUFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5VUFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5ET1dOXG5cdFx0ZWxzZVxuXHRcdFx0IyBJZiB0aGV5IHNwZWNpZmllZCBzb21ldGhpbmcgZGlmZmVyZW50IGp1c3Qgc3dpdGNoIGltbWVkaWF0ZWx5XG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guQ0VOVEVSXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5MRUZUXG5cdFx0XG5cdFx0IyBQdXNoIHZpZXcgdG8gQ2VudGVyXG5cdFx0dmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guQ0VOVEVSXG5cdFx0IyBjdXJyZW50VmlldyBpcyBub3cgb3VyIHByZXZpb3VzVmlld1xuXHRcdEBwcmV2aW91c1ZpZXcgPSBAY3VycmVudFZpZXdcblx0XHQjIFNldCBvdXIgY3VycmVudFZpZXcgdG8gdGhlIHZpZXcgd2UncmUgYnJpbmdpbmcgaW5cblx0XHRAY3VycmVudFZpZXcgPSB2aWV3XG5cblx0XHQjIFN0b3JlIHRoZSBsYXN0IHZpZXcgaW4gaGlzdG9yeVxuXHRcdEBoaXN0b3J5LnB1c2ggQHByZXZpb3VzVmlldyBpZiBwcmV2ZW50SGlzdG9yeSBpcyBmYWxzZVxuXHRcdFxuXHRcdEBlbWl0IEV2ZW50cy5DaGFuZ2VcblxuXHRyZW1vdmVCYWNrQnV0dG9uOiAodmlldykgLT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHRcdFx0dmlldy5zdWJMYXllcnNCeU5hbWUoQkFDS0JVVFRPTl9WSUVXX05BTUUpWzBdLnZpc2libGUgPSBmYWxzZVxuXG5cdGJhY2s6ICgpIC0+XG5cdFx0QHRyYW5zaXRpb24oQF9nZXRMYXN0SGlzdG9yeUl0ZW0oKSwgZGlyZWN0aW9uID0gRElSLkxFRlQsIHN3aXRjaEluc3RhbnQgPSBmYWxzZSwgcHJldmVudEhpc3RvcnkgPSB0cnVlKVxuXHRcdEBoaXN0b3J5LnBvcCgpXG5cblx0X2dldExhc3RIaXN0b3J5SXRlbTogKCkgLT5cblx0XHRyZXR1cm4gQGhpc3RvcnlbQGhpc3RvcnkubGVuZ3RoIC0gMV1cblxuXHRfYXBwbHlCYWNrQnV0dG9uOiAodmlldywgZnJhbWUgPSBAYmFja0J1dHRvbkZyYW1lKSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHRpZiB2aWV3LmJhY2tCdXR0b24gaXNudCBmYWxzZVxuXHRcdFx0XHRiYWNrQnV0dG9uID0gbmV3IExheWVyXG5cdFx0XHRcdFx0bmFtZTogQkFDS0JVVFRPTl9WSUVXX05BTUVcblx0XHRcdFx0XHR3aWR0aDogODBcblx0XHRcdFx0XHRoZWlnaHQ6IDgwXG5cdFx0XHRcdFx0c3VwZXJMYXllcjogdmlld1xuXG5cdFx0XHRcdGlmIEBkZWJ1Z01vZGUgaXMgZmFsc2Vcblx0XHRcdFx0XHRiYWNrQnV0dG9uLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIlxuXG5cdFx0XHRcdGJhY2tCdXR0b24uZnJhbWUgPSBmcmFtZVxuXG5cdFx0XHRcdGJhY2tCdXR0b24ub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0XHRcdEBiYWNrKClcblx0XHRcbiAgICBcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVVNBR0UgRVhBTVBMRSAxIC0gRGVmaW5lIEluaXRpYWxWaWV3TmFtZSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiMgaW5pdGlhbFZpZXdLZXkgPSBcInZpZXcxXCJcbiMgXG4jIHZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgaW5pdGlhbFZpZXdOYW1lOiBpbml0aWFsVmlld0tleVxuIyB2aWV3MSA9IG5ldyBMYXllclxuIyBcdG5hbWU6IGluaXRpYWxWaWV3S2V5XG4jIFx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcbiMgXHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVVNBR0UgRVhBTVBMRSAyIC0gVXNlIGRlZmF1bHQgaW5pdGlhbFZpZXdOYW1lIFwiaW5pdGlhbFZpZXdcIiAjIyMjIyMjIyMjIyMjIyMjIyNcblxuIyB2bmMgPSBuZXcgVmlld05hdmlnYXRpb25Db250cm9sbGVyXG5cbiMgdmlldzEgPSBuZXcgTGF5ZXJcbiMgXHRuYW1lOiBcImluaXRpYWxWaWV3XCJcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXHRcbiMgdmlldzIgPSBuZXcgTGF5ZXJcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMgdmlldzEub24gRXZlbnRzLkNsaWNrLCAtPiB2bmMudHJhbnNpdGlvbiB2aWV3MlxuIyB2aWV3Mi5vbiBFdmVudHMuQ2xpY2ssIC0+IHZuYy5iYWNrKClcblx0Il19
