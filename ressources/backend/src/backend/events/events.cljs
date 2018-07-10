(ns backend.events.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]
    [backend.utils :as utils]
    [backend.events.utils :as event-utils]))

;; --------------------------------------------------------
;; helper functions

(defn changed-event-index [db id]
  (first (utils/positions #(= id (:id %)) (:changed-events db))))

(defn unchanged-event-index [db id]
  (first (utils/positions #(= id (:id %)) (:events db))))

(defn active-event-unchanged-index [db]
  (first (utils/positions #(= (:active-event db) (:id %)) (:events db))))

(defn active-event-unchanged [db]
  (get-in db [:events (active-event-unchanged-index db)]))

(defn event-unchanged [db id]
  (get-in db [:events (unchanged-event-index db id)]))

(defn new-date [previous-value date-string]
  (let [previous-time (clojure.string/replace previous-value #"....-..-.." "")]
    (str date-string previous-time)))

(defn new-time [previous-value goog-time]
  (let [previous-date (clojure.string/replace previous-value #"..:.." "")
        goog-time-str (str goog-time)
        [hours minutes] (case (count goog-time-str)
                          1 ["00" (str "0" goog-time-str)]
                          2 ["00" goog-time-str]
                          3 [(str "0" (first goog-time-str)) (apply str (rest goog-time-str))]
                          4 [(subs goog-time-str 0 2) (subs goog-time-str 2 4)])]
    (str previous-date hours ":" minutes)))

;;---------------------------------------------------------
;; from / to server

(rf/reg-event-fx
  :jups.backend.events/->events
  (fn [_ _]
    {:http-xhrio {:method          :get
                  :uri             "http://api.festival-jups.ch/events/"
                  :timeout         8000
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/events]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/events
  (fn [db [_ {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (assoc :events data))))



(rf/reg-event-fx
  :jups.backend.events/->update-event
  (fn [{:keys [db]} [_ event-id]]
    {:http-xhrio {:method          :put
                  :uri             (str "http://api.festival-jups.ch/events/" event-id)
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :params          {:session (:session db)
                                    :data    (get-in db [:changed-events (changed-event-index db event-id)])}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/update-event event-id]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/update-event
  (fn [db [_ event-id {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (assoc-in [:events (unchanged-event-index db event-id)] data))))



(rf/reg-event-fx
  :jups.backend.events/->delete-event
  (fn [_ [_ event-id]]
    {:http-xhrio {:method          :delete
                  :uri             (str "http://api.festival-jups.ch/events/" event-id)
                  :timeout         8000
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/delete-event event-id]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/delete-event
  (fn [db [_ event-id {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (update-in [:changed-events] #(dissoc % (changed-event-index db event-id))))))



(rf/reg-event-fx
  :jups.backend.events/->create-event
  (fn [{:keys [db]} [_ event-id]]
    {:http-xhrio {:method          :post
                  :uri             (str "http://api.festival-jups.ch/events/" event-id)
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :params          {:session (:session db)
                                    :data    (get-in db [:changed-events (changed-event-index db event-id)])}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/create-event event-id]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/create-event
  (fn [db [_ event-id {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (update-in [:events] #(conj % data)))))

;; -----------------------------------------------------------
;; change event

(rf/reg-event-db
  :jups.backend.events/active-event
  (fn [db [_ id]]
    (letfn [(put-event-in-changed-list [db]
              (if (event-utils/active-event-index db)
                db
                (update-in db [:changed-events] #(conj % (active-event-unchanged db) ))))]
      (-> db
          (assoc :active-event id)
          put-event-in-changed-list))))

(rf/reg-event-db
  :jups.backend.events/change-event
  (fn [db [_ kw v]]
    (assoc-in db [:changed-events (event-utils/active-event-index db) kw] v)))

(rf/reg-event-db
  :jups.backend.events/change-event-date
  (fn [db [_ kw date-string]]
    (let [
          previous-value (kw (event-utils/active-event db))
          new-value (new-date previous-value date-string)]
      (assoc-in db [:changed-events (event-utils/active-event-index db) kw] new-value))))

(rf/reg-event-db
  :jups.backend.events/change-event-time
  (fn [db [_ kw goog-time]]
    (let [previous-value (kw (event-utils/active-event db))
          new-value (new-time previous-value goog-time)]
      (assoc-in db [:changed-events (event-utils/active-event-index db) kw] new-value))))

(rf/reg-event-db
  :jups.backend.events/select-years-dropdown
  (fn [db [_ kw year-kw]]
    (if (= :none year-kw)
      (assoc-in db [:changed-events (event-utils/active-event-index db) kw] nil)
      (assoc-in db [:changed-events (event-utils/active-event-index db) kw] (str (name year-kw) "/")))))

(rf/reg-event-db
  :jups.backend.events/select-files-dropdown
  (fn [db [_ kw file-name]]
    (update-in db [:changed-events (event-utils/active-event-index db) kw] #(str (first (clojure.string/split % "/")) "/" file-name))))

(rf/reg-event-db
  :jups.backend.events/event-discard-changes
  (fn [db [_ event-id]]
    (assoc-in db [:changed-events (changed-event-index db event-id)] (event-unchanged db event-id))))