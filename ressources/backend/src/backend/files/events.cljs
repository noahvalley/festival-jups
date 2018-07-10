(ns backend.files.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]))

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
