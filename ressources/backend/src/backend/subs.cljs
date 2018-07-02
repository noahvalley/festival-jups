(ns backend.subs
  (:require
   [re-frame.core :as rf]
   [backend.utils :as utils]))

(rf/reg-sub
 :jups.backend.subs/active-panel
 (fn [db _]
   (:active-panel db)))

(rf/reg-sub
  :jups.backend.subs/session
  (fn [db _]
    (:session db)))

(rf/reg-sub
  :jups.backend.subs/username
  (fn [db _]
    (:username db)))

(rf/reg-sub
  :jups.backend.subs/password
  (fn [db _]
    (:password db)))

(rf/reg-sub
  :jups.backend.subs/pages
  (fn [db _]
    (:pages db)))

(rf/reg-sub
  :jups.backend.subs/events
  (fn [db _]
    (:events db)))

(rf/reg-sub
  :jups.backend.subs/changed-events
  (fn [db _]
    (:changed-events db)))

(rf/reg-sub
  :jups.backend.subs/active-event-id
  (fn [db _]
    (:active-event db)))

(rf/reg-sub
  :jups.backend.subs/active-event-index
  (fn [_]
    [(rf/subscribe [:jups.backend.subs/changed-events])
     (rf/subscribe [:jups.backend.subs/active-event-id])])
  (fn [[changed-events active-event-id]]
    (first (utils/positions #(= active-event-id (:id %)) changed-events))))

  (rf/reg-sub
    :jups.backend.subs/active-event
    (fn [_]
      [(rf/subscribe [:jups.backend.subs/changed-events])
       (rf/subscribe [:jups.backend.subs/active-event-index])])
    (fn [[changed-events active-event-index]]
      (get changed-events active-event-index)))

  (rf/reg-sub
    :active-event-unchanged-index
    (fn [_]
      [(rf/subscribe [:jups.backend.subs/active-event-id])
       (rf/subscribe [:jups.backend.subs/events])])
    (fn [[active-event-id events]]
      (first (utils/positions #(= active-event-id (:id %)) events))))

  (rf/reg-sub
    :jups.backend.subs/active-event-unchanged
    (fn [_]
      [(rf/subscribe [:jups.backend.subs/events])
       (rf/subscribe [:jups.backend.subs/active-event-unchanged-index])])
    (fn [[events active-event-unchanged-index]]
      (get events active-event-unchanged-index)))

(rf/reg-sub
  :jups.backend.subs/active-event-field
  (fn [_]
    (rf/subscribe [:jups.backend.subs/active-event]))
  (fn [event [_ kw]]
    (kw event)))

(rf/reg-sub
  :jups.backend.subs/active-event-time
  (fn [_]
    (rf/subscribe [:jups.backend.subs/active-event]))
  (fn [event [_ kw]]
    (let [datetime (kw event)]
      (-> datetime
          (clojure.string/replace #"....-..-..T" "")
          (clojure.string/replace #":" "")
          js/parseInt))))
