(ns backend.events.subs
  (:require
    [re-frame.core :as rf]
    [backend.utils :as utils]))

(rf/reg-sub
  :jups.backend.subs/events
  (fn [db _]
    (:events db)))

(rf/reg-sub
  :jups.backend.subs/event
  (fn [db [_ id]]
    (some #(= id (:id %)) (:events db))))

(rf/reg-sub
  :jups.backend.subs/changed-events
  (fn [db _]
    (:changed-events db)))

(rf/reg-sub
  :jups.backend.subs/changed-event
  (fn [db [_ id]]
    (some #(if (= id (:id %)) %) (:changed-events db))))

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
      (if datetime
        (-> datetime
            (clojure.string/replace #"....-..-..T" "")
            (clojure.string/replace #":" "")
            js/parseInt)))))

(rf/reg-sub
  :jups.backend.subs/active-event-image-year
  (fn [[_ kw]]
    [(rf/subscribe [:jups.backend.subs/active-event-field kw])])
  (fn [[url]]
    (let [raw (first (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        (keyword raw)))))

(rf/reg-sub
  :jups.backend.subs/active-event-image-file
  (fn [[_ kw]]
    [(rf/subscribe [:jups.backend.subs/active-event-field kw])])
  (fn [[url]]
    (let [raw (second (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        raw))))