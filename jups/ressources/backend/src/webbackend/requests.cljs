(ns webbackend.requests
  (:require [cljs-http.client :as http]
            [cljs.core.async :refer [go <!]]))

(defn success? [global response]
  (let [error (-> response :body :error)
        success (not (or (nil? error)
                         (true? (:error error))))]
    (if  success
        (swap! global #(assoc % :error nil))
        (note-error global response))
    success))


(defn note-error [global response]
  (let [error (-> response :body :error)]
    (if (nil? error)
        (swap! global
               #(assoc % :error "server not reachable"))
        (swap! global
               #(assoc % :error (:message error))))))

(defn login-request [global]
  (go (let [response (<! (http/post "http://api.festival-jups.ch/login"
                                    {:json-params       {:session ""
                                                         :data    {:username (:username global)
                                                                   :password (:password global)}}
                                     :with-credentials? false}))]
        (if (success? global response)
            (swap! global
                   #(assoc % :session (-> response :body :data :session)))))))

(defn get-list [global type content-list]
  (go (let [response (<! (http/get (str "http://api.festival-jups.ch/" type)
                                   {:with-credentials? false}))]
        (if (success? global response)
            (reset! content-list (-> response :body :data))))))

#_(defn login-check [session]
    (http/get "http://api.festival-jups.ch/logincheck"
              {:json-params {:session @session}
               :with-credentials? false}))

#_(defn do-and-refresh [todo]
    (go (let [response (<! (delete-file type file-name session))]
          (reset! file-list (-> response
                                :body
                                :data)))))

(defn delete-file [global type file-name file-list]
  (go (let [response (<! (http/delete (str "http://api.festival-jups.ch/" type "/" file-name)
                                      {:with-credentials? false
                                       :json-params       {:session (:session @global)}}))]
        (if (success? global response)
            (reset! file-list (-> response :body :data))))))

(defn upload-file [global type file file-list]
  (go (let [response (http/post (str "http://api.festival-jups.ch/" type)
                                {:multipart-params  [["session" (:session @global)] ["file" @file]]
                                 :with-credentials? false})]
        (if (success? response)
            (reset! file-list (-> response :body :data))))))

(defn update-event [event session]
  (http/put (str "http://api.festival-jups.ch/events/" (:id @event))
            {:json-params       {:session @session
                                 :data @event}
             :with-credentials? false}))

(defn new-event [event session]
  (http/post "http://api.festival-jups.ch/events/"
             {:json-params       {:session @session
                                  :data @event}
              :with-credentials? false}))

(defn delete-event [event session]
  (http/delete (str "http://api.festival-jups.ch/events/" (:id @event))
               {:json-params       {:session @session}
                :with-credentials? false}))