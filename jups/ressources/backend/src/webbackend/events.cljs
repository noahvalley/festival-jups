(ns webbackend.events
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]
    [webbackend.prosemirror :refer [prosemirror get-html-string]]
    [webbackend.fields :refer [field checkbox dropdown dropdown-image upload-field]])
  (:require-macros [cljs.core.async :refer [go]]))

(defn file-list [files]
  (go (let [response (<! (http/get "http://api.festival-jups.ch/file"
                                   {:with-credentials? false}))]
        (reset! files (-> response :body :data)))))

(defn image-list [images]
  (go (let [response (<! (http/get "http://api.festival-jups.ch/image"
                                   {:with-credentials? false}))]
        (reset! images (-> response :body :data)))))

(defn events-list [events]
  (go (let [response (<! (http/get "http://api.festival-jups.ch/events"
                                   {:with-credentials? false}))]
        (reset! events (:body response)))))

#_(defn login-check [session]
    (http/get "http://api.festival-jups.ch/logincheck"
              {:json-params {:session @session}
               :with-credentials? false}))

(defn logout [session]
  (reset! session nil))

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

(defn event-list[global]
  (let [events (r/cursor global [:events])
        event (r/cursor global [:event])
        session (r/cursor global [:session])]
    [:div
     [upload-field "image" (r/cursor global [:image]) session (r/cursor global [:images])]
     [:div
      [:button {:on-click #(
                             (delete-event event session)
                             (events-list events))}
       "löschen"]
      [:button {:on-click #(reset! event {:ausverkauft false})}
       "neu"]
      [:button {:on-click (fn []
                            (swap! event #(assoc % :text (get-html-string)))
                            (if (:id @event)
                              (update-event event session)
                              (new-event event session))
                            (events-list events))}
       "speichern"]]
     [:ul (for [list-event (:data @events)]
            ^{:key (:id list-event)}
            [:li
             [:a {:style    {:cursor "pointer"}
                  :on-click (fn [] (reset! event list-event))}
              (or (:titel list-event) "OHNE TITEL")]])]]))

(defn event-form [global]
  (let [event (r/cursor global [:event])
        images (r/cursor global [:images])
        files (r/cursor global [:files])]
    [:div {:style {:display        "flex"
                   :flex-direction "column"
                   :width          "100%"}}
     [field "text" :titel "Titel" event]
     [field "text" :untertitel "Untertitel" event]
     [dropdown ["workshop" "veranstaltung" "offenesangebot"] :type "Typ" event]
     [field "text" :ort "Ort" event]
     [field "datetime-local" :zeitVon "Beginn" event]
     [field "datetime-local" :zeitBis "Ende" event]
     [field "number" :priority "Priorität" event]
     [dropdown-image (cons "" @images) :bild "Bild" event]
     [dropdown-image (cons "" @images) :logo "Logo" event]
     [prosemirror :text @event]
     [checkbox :ausverkauft "Ausverkauft" event]
     [field "text" :ausverkauftText "Ausverkauft" event]
     [field "text" :abAlter "Mindestalter" event]
     [field "text" :tuerOeffnung "Türöffnung" event]
     [field "text" :preis "Preis" event]]))

(defn events-form-success [global]
  [:div {:style {:display        "flex"
                 :flex-direction "row"
                 :justify-content "space-between"
                 :width "100%"
                 :height "100%"}}
   [event-list global]
   [event-form global]])

(defn events-form [global]
  (let [events (r/cursor global [:events])
        images (r/cursor global [:images])
        files (r/cursor global [:files])]
    (events-list events)
    (file-list files)
    (image-list images)
    (fn []
      (cond (:error (:error @events)) [:div [:p (:message (:error (@events)))]]
            :default [events-form-success global]))))
