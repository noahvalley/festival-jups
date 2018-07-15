(ns backend.files.events
  (:require
    [re-frame.core :as rf]
    [ajax.core :as ajax]))

(rf/reg-event-fx
  :jups.backend.events/->file-list
  (fn [{:keys [db]} [_ list-kw]]
    {:http-xhrio {:method          :get
                  :uri             (str "http://api.festival-jups.ch/" (name list-kw))
                  :timeout         8000
                  :response-format (ajax/json-response-format {:keywords? true})
                  :on-success      [:jups.backend.events/file-list list-kw]
                  :on-failure      [:jups.backend.events/request-error]}}))

(rf/reg-event-db
  :jups.backend.events/file-list
  (fn [db [_ list-kw {:keys [:error :data]}]]
    (cond-> db
            true (assoc :error error)
            (not (:error error)) (assoc list-kw data))))

(defn generate-form-data [params]
  (let [form-data (js/FormData.)]
    (doseq [[k v] params]
      (if (coll? v)
        (.append form-data (name k) (first v) (second v))
        (.append form-data (name k) v)))
    form-data))

(rf/reg-event-fx
  :jups.backend.events/upload-files
  (fn [{:keys [db]} [_ list-kw files]]
    (let [multipart-params (generate-form-data
                             (conj (map (fn [file] ["file" file]) @files) ["session" (:session db)]))]
      {:http-xhrio {:method          :post
                    :uri             (str "http://api.festival-jups.ch/" (name list-kw))
                    :params          multipart-params
                    :format          {:write identity}
                    :timeout         8000
                    :response-format (ajax/json-response-format {:keywords? true})
                    :on-success      [:jups.backend.events/file-list list-kw]
                    :on-failure      [:jups.backend.events/request-error]}})))

(rf/reg-event-fx
  :jups.backend.events/->delete-file
  (fn [{:keys [db]} [_ list-kw]]
    (let [url (-> db :files-dropdowns list-kw)]
      (if (= 2 (count (clojure.string/split url "/")))
        {:http-xhrio {:method          :delete
                      :uri             (str "http://api.festival-jups.ch/" (name list-kw) "/" url)
                      :format          (ajax/json-request-format)
                      :params          {:session (:session db)}
                      :timeout         8000
                      :response-format (ajax/json-response-format {:keywords? true})
                      :on-success      [:jups.backend.events/file-list list-kw]
                      :on-failure      [:jups.backend.events/request-error]}}))))

(rf/reg-event-db
  :jups.backend.events/files-year
  (fn [db [_ list-kw year-kw]]
    (if (= :none year-kw)
      (assoc-in db [:files-dropdowns list-kw] nil)
      (assoc-in db [:files-dropdowns list-kw] (str (name year-kw) "/")))))

(rf/reg-event-db
  :jups.backend.events/files-file
  (fn [db [_ list-kw file-name]]
    (update-in db [:files-dropdowns list-kw] #(str (first (clojure.string/split % "/")) "/" file-name))))
