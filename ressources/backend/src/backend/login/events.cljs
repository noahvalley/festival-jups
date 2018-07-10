(ns backend.login.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]))


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
    {:navigate "/events"
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
