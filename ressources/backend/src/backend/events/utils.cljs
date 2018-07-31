(ns backend.events.utils
  (:require [backend.utils :as utils]))

;; -----------------------------------------
;; helper functions

(defn active-event-index [db]
  (first (utils/positions #(= (:active-event db) (:id %)) (:changed-events db))))

(defn active-event [db]
  (get-in db [:changed-events (active-event-index db)]))
