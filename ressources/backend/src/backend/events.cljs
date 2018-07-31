(ns backend.events
  (:require
    [re-frame.core :as rf]
    [backend.db :as db]
    [ajax.core :as ajax]
    [backend.utils :as utils]))

;; ------------------------------------------------------------------
;; re-frame

(rf/reg-event-db
  :jups.backend.events/initialize-db
  (fn [_ _]
    db/default-db))

(rf/reg-event-db
  :jups.backend/set-active-panel
  (fn [db [_ active-panel]]
    (assoc db :active-panel active-panel)))

(rf/reg-event-fx
  :jups.backend/navigate
  (fn [_ [_ url]]
    {:navigate url}))

;; ------------------------------------------------------------
;; error

(rf/reg-event-db
  :jups.backend.events/request-error
  (fn [db _]
    (assoc db :error {:error   true
                      :message "server not reachable"})))
