(ns backend.pages.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]))

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
            (not (:error error)) (-> (assoc :pages data)
                                     (assoc :changed-pages data)))))



(rf/reg-event-fx
  :jups.backend.events/->update-page
  (fn [{:keys [db]} [_ page-kw]]
    {:http-xhrio {:method          :put
                  :uri             (str "http://api.festival-jups.ch/pages/" (name page-kw))
                  :timeout         8000
                  :format          (ajax/json-request-format)
                  :params          {:session (:session db)
                                    :data    (-> db :changed-pages page-kw)}
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/update-page page-kw]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/update-page
  (fn [db [_ page-kw {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (->
                                   (assoc-in [:pages page-kw] data)
                                   (update-in [:changed-pages]
                                              #(dissoc % page-kw))))))

(rf/reg-event-db
  :jups.backend.subs/active-page
  (fn [db [_ page-kw]]
    (assoc db :active-page page-kw)))

(rf/reg-event-db
  :jups.backend.events/page-discard-changes
  (fn [db [_ page-kw]]
    (assoc-in db [:changed-pages page-kw] (-> db :pages page-kw))))