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

;; --------------------------------------------------------------
;; login

(rf/reg-event-fx
  :jups.backend.events/->login
  (fn [{:keys [db]} _]
    {:http-xhrio {:method          :post
                  :uri             "http://api.festival-jups.ch/login"
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :params          {:session ""
                                    :data    {:username (:username db)
                                              :password (:password db)}}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/login]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-fx
  :jups.backend.events/login
  (fn [{:keys [db]} [_ {:keys [:error :data]}]]
    {:navigate "#/events"
     :dispatch-n [[:jups.backend.events/->events]
                  [:jups.backend.events/->pages]
                  [:jups.backend.events/->images]
                  [:jups.backend.events/->files]]
     :db       (cond-> db
                       true (assoc :error error)
                       (not (:error error)) (-> (assoc :session (:session data))
                                                (update-in [:changed-events] #(conj % backend.db/empty-event))))}))

(rf/reg-event-db
  :jups.backend.events/change-username
  (fn [db [_ username]]
    (assoc db :username username)))

(rf/reg-event-db
  :jups.backend.events/change-password
  (fn [db [_ password]]
    (assoc db :password password)))

;;---------------------------------------------------------
;; events

(rf/reg-event-fx
  :jups.backend.events/->events
  (fn [{:keys [db]} _]
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
                                    :data    (get-in db [:changed-events (utils/changed-event-index db event-id)])}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/events event-id]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/update-event
  (fn [db [_ event-id {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (->
                                   (assoc :events data)
                                   (update-in [:changed-events] #(dissoc % event-id))))))



(rf/reg-event-fx
  :jups.backend.events/->delete-event
  (fn [{:keys [db]} [_ event-id]]
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
            (not (:error error)) (update-in [:changed-events] #(dissoc % event-id)))))



(rf/reg-event-fx
  :jups.backend.events/->create-event
  (fn [{:keys [db]} [_ event-id]]
    {:http-xhrio {:method          :post
                  :uri             (str "http://api.festival-jups.ch/events/" event-id)
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :params          {:session (:session db)
                                    :data    (-> db :changed-events event-id)}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/create-event event-id]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/create-event
  (fn [db [_ event-id {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (->
                                   (update-in [:events] #(conj % data))
                                   (update-in [:changed-events] #(dissoc % event-id))))))

;; ---------------------------------------------------------------------
;; files & images

(rf/reg-event-fx
  :jups.backend.events/->images
  (fn [{:keys [db]} _]
    {:http-xhrio {:method          :get
                  :uri             "http://api.festival-jups.ch/images/"
                  :timeout         8000
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/images]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/images
  (fn [db [_ {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (assoc :images data))))

(rf/reg-event-fx
  :jups.backend.events/->files
  (fn [{:keys [db]} _]
    {:http-xhrio {:method          :get
                  :uri             "http://api.festival-jups.ch/files/"
                  :timeout         8000
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/files]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/files
  (fn [db [_ {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (assoc :files data))))


;; -----------------------------------------------------------------------
;; pages

(rf/reg-event-fx
  :jups.backend.events/->pages
  (fn [{:keys [db]} _]
    {:http-xhrio {:method          :get
                  :uri             "http://api.festival-jups.ch/pages/"
                  :timeout         8000
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/pages]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/pages
  (fn [db [_ {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (assoc :pages data))))



(rf/reg-event-fx
  :jups.backend.events/->update-page
  (fn [{:keys [db]} [_ page]]
    {:http-xhrio {:method          :put
                  :uri             (str "http://api.festival-jups.ch/pages/" (name page))
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :params          {:session (:session db)
                                    :data    (-> db :changed-pages page)}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/update-page page]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/update-page
  (fn [db [_ page {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (->
                                   (assoc-in [:pages page] data)
                                   (update-in [:changed-pages]
                                              #(dissoc % page))))))



;; ------------------------------------------------------------
;; error

(rf/reg-event-db
  :jups.backend.events/request-error
  (fn [db _]
    (assoc db :error {:error   true
                      :message "server not reachable"})))

;; -----------------------------------------------------------
;; change event

(rf/reg-event-db
  :jups.backend.events/active-event
  (fn [db [_ id]]
    (letfn [(put-event-in-changed-list [db]
              (if (utils/active-event-index db)
                db
                (update-in db [:changed-events] #(conj % (utils/active-event-unchanged db) ))))]
      (-> db
          (assoc :active-event id)
          put-event-in-changed-list))))

(rf/reg-event-db
  :jups.backend.events/change-event
  (fn [db [_ kw v]]
    (assoc-in db [:changed-events (utils/active-event-index db) kw] v)))

(rf/reg-event-db
  :jups.backend.events/change-event-date
  (fn [db [_ kw date-string]]
    (let [
          previous-value (kw (utils/active-event db))
          new-value (utils/new-date previous-value date-string)]
      (assoc-in db [:changed-events (utils/active-event-index db) kw] new-value))))

(rf/reg-event-db
  :jups.backend.events/change-event-time
  (fn [db [_ kw goog-time]]
    (let [previous-value (kw (utils/active-event db))
          new-value (utils/new-time previous-value goog-time)]
      (assoc-in db [:changed-events (utils/active-event-index db) kw] new-value))))

(rf/reg-event-db
  :jups.backend.events/select-years-dropdown
  (fn [db [_ kw year-kw]]
    (if (= :none year-kw)
      (assoc-in db [:changed-events (utils/active-event-index db) kw] nil)
      (assoc-in db [:changed-events (utils/active-event-index db) kw] (str (name year-kw) "/")))))

(rf/reg-event-db
  :jups.backend.events/select-files-dropdown
  (fn [db [_ kw file-name]]
    (update-in db [:changed-events (utils/active-event-index db) kw] #(str (first (clojure.string/split % "/")) "/" file-name))))
