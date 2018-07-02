(ns backend.routes
  (:require-macros [secretary.core :refer [defroute]])
  (:import goog.History)
  (:require
   [secretary.core :as secretary]
   [goog.events :as gevents]
   [goog.history.EventType :as EventType]
   [re-frame.core :as rf]
   [backend.events :as events]))

(rf/reg-fx
  :navigate
  (fn [url]
    (secretary/dispatch! url)))

(defn hook-browser-navigation! []
  (doto (History.)
    (gevents/listen
     EventType/NAVIGATE
     (fn [event]
       (secretary/dispatch! (.-token event))))
    (.setEnabled true)))

(defn app-routes []
  (secretary/set-config! :prefix "#")
  ;; --------------------
  ;; define routes here
  (defroute "/" []
            (rf/dispatch [:jups.backend/set-active-panel :home-panel]))

  (defroute "/about" []
    (rf/dispatch [:jups.backend/set-active-panel :about-panel]))


  ;; --------------------
  (hook-browser-navigation!))
