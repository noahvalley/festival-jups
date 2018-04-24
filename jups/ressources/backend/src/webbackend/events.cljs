(ns webbackend.events
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]
    [webbackend.prosemirror :refer [prosemirror get-html-string]]
    [webbackend.fields :refer [field checkbox dropdown double-dropdown-image upload-field delete-field]]
    [webbackend.requests :refer [get-list new-event update-event delete-event]])
  (:require-macros [cljs.core.async :refer [go]]))

#_(defn logout [session]
    (reset! session nil))

(defn update-selected-values [global event property-key]
  (let [year-key (keyword (str "selected-year-" (name property-key)))
        thing-key (keyword (str "selected-" (name property-key)))]
    (swap! global
           (fn [g]
             (let [parsed-path (clojure.string/split (property-key event) "/")]
               (-> g
                   (assoc year-key
                          (or (first parsed-path) ""))
                   (assoc thing-key
                          (or (second parsed-path) ""))))))))

(defn event-list[global]
  (let [events (r/cursor global [:events])
        event (r/cursor global [:event])
        session (r/cursor global [:session])]
    [:div
     [:div
      [:button
       {:on-click #(do
                     (delete-event event session)
                     (get-list global "events" events)
                     (reset! event {:ausverkauft false}))}
       "löschen"]
      [:button
       {:on-click (fn [e]
                    (let [new-event {:ausverkauft false}]
                      (update-selected-values global new-event :bild)
                      (update-selected-values global new-event :logo)
                      (reset! event new-event)))}
       "neu"]
      [:button {:on-click (fn []
                            (swap! event #(assoc % :text (get-html-string)))
                            (if (:id @event)
                              (update-event event session)
                              (new-event event session))
                            (get-list global "events" events))}
       "speichern"]]
     [:ul (for [list-event @events]
            ^{:key (:id list-event)}
            [:li
             [:a {:style    {:cursor "pointer"}
                  :on-click (fn []
                              (update-selected-values global list-event :bild)
                              (update-selected-values global list-event :logo)
                              (reset! event list-event))}
              (or (:titel list-event) "OHNE TITEL")]])]]))

(defn event-form [global]
  (let [event (r/cursor global [:event])
        images (r/cursor global [:images])]
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
     [double-dropdown-image global :bild :images "Bild"]
     [double-dropdown-image global :logo :images "Logo"]
     [prosemirror :text @event]
     [checkbox :ausverkauft "Ausverkauft" event]
     [field "text" :ausverkauftText "Ausverkauft" event]
     [field "text" :abAlter "Mindestalter" event]
     [field "text" :tuerOeffnung "Türöffnung" event]
     [field "text" :preis "Preis" event]]))

(defn events-form [global]
  (let [events (r/cursor global [:events])
        images (r/cursor global [:images])
        files (r/cursor global [:files])]
    (get-list global "events" events)
    (get-list global "files" files)
    (get-list global "images" images)
    [:div {:style {:display         "flex"
                   :flex-direction  "column"}}
     [:p (:error global)]
     [:div {:style {:display         "flex"
                    :flex-direction  "row"
                    :justify-content "space-between"
                    :width           "100%"
                    :height          "100%"}}
      [event-list global]
      [event-form global]]]))
