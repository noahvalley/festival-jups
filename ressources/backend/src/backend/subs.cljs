(ns backend.subs
  (:require
    [re-frame.core :as rf]
    [backend.utils :as utils]))

(rf/reg-sub
  :jups.backend.subs/active-panel
  (fn [db _]
    (:active-panel db)))

(rf/reg-sub
  :jups.backend.subs/db
  (fn [db [_ path]]
    (get-in db path)))

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

(rf/reg-sub
  :jups.backend.subs/event-image-year
  (fn [[_ kw]]
    [(rf/subscribe [:jups.backend.subs/active-event-field kw])])
  (fn [[url]]
    (let [raw (first (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        (keyword raw)))))

(rf/reg-sub
  :jups.backend.subs/event-image-file
  (fn [[_ kw]]
    [(rf/subscribe [:jups.backend.subs/active-event-field kw])])
  (fn [[url]]
    (let [raw (second (clojure.string/split url "/"))]
      (if (= raw "")
        nil
        raw))))

(rf/reg-sub
  :jups.backend.subs/years-dropdown
  (fn [db [_ images-or-files]]
    (conj (mapv (fn [k] {:id k :label (name k)}) (keys (images-or-files db))) {:id :none :label "ohne"})))

(rf/reg-sub
  :jups.backend.subs/files-dropdown
  (fn [db [_ images-or-files kw]]
    (let [url (get-in db [:changed-events (utils/active-event-index db) kw])
          chosen-year (keyword (first (clojure.string/split url "/")))]
      (mapv (fn [file-name] {:id file-name :label file-name})
            (get-in db [images-or-files chosen-year])))))
