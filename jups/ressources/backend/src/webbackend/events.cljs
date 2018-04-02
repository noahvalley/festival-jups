(ns webbackend.events
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]
    [webbackend.prosemirror :refer [prosemirror get-html-string]]
    [webbackend.fields :refer [field checkbox]])
  (:require-macros [cljs.core.async :refer [go]]))

(def file (atom {:file nil}))
(def events (r/atom {}))
(def event (r/atom {:ausverkauft false}))

(defn read-events []
  (go (let [response (<! (http/get "http://api.festival-jups.ch:8000/events"
                                   {:with-credentials? false}))]
        (reset! events (:body response)))))

(read-events)

(defn put-event []
      (http/put (str "http://api.festival-jups.ch:8000/events/" (:id @event))
                {:json-params       @event
                 :with-credentials? false}))

(defn post-event []
  (http/post "http://api.festival-jups.ch:8000/events/" {:json-params @event}
            :with-credentials? false))

#_(defn get-event-by-id [id]
    (get-in events [:data (.indexOf (map :id (:data @events)) id)]))

(defn event-list[]
  [:div
   [:div
    [:button {:on-click #(reset! event {:ausverkauft false})}
     "neu"]
    [:button {:on-click (fn []
                          (swap! event #(assoc % :text (get-html-string)))
                          (if (:id event)
                            (post-event)
                            (put-event))
                          (read-events))}
     "speichern"]]
   [:ul (for [list-event (:data @events)]
          ^{:key (:id list-event)}
          [:li
           [:a {:style    {:cursor "pointer"}
                :on-click (fn [] (reset! event list-event))}
            (or (:titel list-event) "OHNE TITEL")]])]])

(defn event-form []
  [:form
   [:div
    [field "text" :type "Typ" event]
    [field "text" :titel "Titel" event]
    [field "text" :untertitel "Untertitel" event]
    [field "text" :ort "Ort" event]
    [field "datetime-local" :zeitVon "Beginn" event]
    [field "datetime-local" :zeitBis "Ende" event]
    [field "number" :priority "Priorität" event]
    [field "text" :bild "Bild" event]
    [field "text" :logo "Logo" event]
    [prosemirror :text @event]
    [checkbox :ausverkauft "Ausverkauft" event]
    [field "text" :ausverkauftText "Text Ausverkauft" event]
    [field "text" :abAlter "Mindestalter" event]
    [field "text" :tuerOeffnung "Türöffnung" event]
    [field "text" :preis "Preis" event]]])

(defn events-form-success []
  [:div {:style {:display        "flex"
                 :flex-direction "row"
                 :width "100%"
                 :height "100%"}}
   [event-list]
   [event-form]])

(defn events-form []
  (fn []
    (cond (:error (:error @events)) [:div [:p (:message (:error (@events)))]]
          :default (events-form-success))))
