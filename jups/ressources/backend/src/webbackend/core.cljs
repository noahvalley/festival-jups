(ns webbackend.core
    (:require
      [reagent.core :as r]
      [webbackend.main :refer [main]]))

;; -------------------------
;; Main view


;; -------------------------
;; Initialize app
(defn mount-root []
  (r/render [main] (.getElementById js/document "app")))

(defn init! []
  (mount-root))
