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
    (set! (.-hash js/window.location) url)))

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

  (defroute "/events" []
    (rf/dispatch [:jups.backend/set-active-panel :events-panel]))

  (defroute "/pages" []
            (rf/dispatch [:jups.backend/set-active-panel :pages-panel]))

  (defroute "/files" []
            (rf/dispatch [:jups.backend/set-active-panel :files-panel]))

  ;; --------------------
  (hook-browser-navigation!))
