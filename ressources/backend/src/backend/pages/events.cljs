(ns backend.pages.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]
    [backend.utils :as utils]))

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
