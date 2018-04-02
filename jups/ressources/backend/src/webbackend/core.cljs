(ns webbackend.core
    (:require
      [reagent.core :as r]
      [webbackend.events :refer [random-form events-form event-list]]
      [webbackend.entry :refer [home-page]]))

;; -------------------------
;; Initialize app
(defn mount-root []
  (r/render [events-form] (.getElementById js/document "app")))

(defn init! []
  (mount-root))
