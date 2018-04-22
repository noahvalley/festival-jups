(ns webbackend.events
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]
    [webbackend.prosemirror :refer [prosemirror get-html-string]]
    [webbackend.fields :refer [field checkbox dropdown dropdown-image upload-field delete-field]]
    [webbackend.requests :refer [get-list new-event update-event delete-event]])
  (:require-macros [cljs.core.async :refer [go]]))

#_(defn logout [session]
    (reset! session nil))

(defn event-list[global]
  (let [events (r/cursor global [:events])
        event (r/cursor global [:event])
        session (r/cursor global [:session])
        image-list (r/cursor global [:images])]
    [:div
     [upload-field global "Bild speichern" "image" (r/cursor global [:image]) image-list]
     [delete-field global "Bild löschen" "image" image-list]
     [:div
      [:button {:on-click #(
                             (delete-event event session)
                             (get-list global "events" events))}
       "löschen"]
      [:button {:on-click #(reset! event {:ausverkauft false})}
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
                  :on-click (fn [] (reset! event list-event))}
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
     [dropdown-image (cons "" @images) :bild "Bild" event]
     [dropdown-image (cons "" @images) :logo "Logo" event]
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
    (get-list global "file" files)
    (get-list global "image" images)
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
