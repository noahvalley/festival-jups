(ns webbackend.events
  (:require
    [reagent.core :as r]
    [webbackend.prosemirror :refer [prosemirror get-html-string]]
    [webbackend.fields :refer [field checkbox dropdown double-dropdown-image]]
    [webbackend.requests :refer [get-list new-event update-event delete-event]]))

(def empty-event {:type "workshop"
                  :zeitBis "2000-12-31T23:42"
                  :zeitVon "2000-12-31T23:42"
                  :ausverkauft false
                  :priority 1})

(defn compare-events [a b]
  (let [dateA (or (first (clojure.string/split (:zeitVon a) "T")) "0")
        dateB (or (first (clojure.string/split (:zeitVon b) "T")) "0")]
    (cond
      (< dateA dateB) -1
      (> dateA dateB) 1
      (> (:priority a) (:priority b)) 1
      (< (:priority a) (:priority b)) -1
      :default 0)))

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
       {:on-click (fn []
                    (delete-event global event session empty-event))}
       "löschen"]
      [:button
       {:on-click (fn []
                    (let [new-event empty-event]
                      (update-selected-values global new-event :bild)
                      (update-selected-values global new-event :logo)
                      (reset! event new-event)))}
       "neu"]
      [:button
       {:on-click (fn []
                    (swap! event #(assoc % :text (get-html-string)))
                    (swap! event #(dissoc % :id))
                    (new-event global event session))}
       "kopieren"]
      [:button
       {:on-click (fn []
                    (swap! event #(assoc % :text (get-html-string)))
                    (if (:id @event)
                      (update-event global event session)
                      (new-event global event session)))}
       "speichern"]]
     [:ul (for [list-event (sort compare-events @events)]
            ^{:key (:id list-event)}
            [:li
             [:a {:style    {:cursor "pointer"}
                  :on-click (fn []
                              (update-selected-values global list-event :bild)
                              (update-selected-values global list-event :logo)
                              (reset! event list-event))}
              (or (:titel list-event) "OHNE TITEL")]])]]))

(defn event-form [global]
  (let [event (r/cursor global [:event])]
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
        files (r/cursor global [:files])
        pages (r/cursor global [:pages])]
    (get-list global "events" events)
    (get-list global "files" files)
    (get-list global "images" images)
    (get-list global "pages" pages)
    [:div {:style {:display         "flex"
                   :flex-direction  "column"}}
     [:p (:error global)]
     [:div {:style {:display         "flex"
                    :flex-direction  "row"
                    :justify-content "space-between"}}
      [event-list global]
      [event-form global]]]))
