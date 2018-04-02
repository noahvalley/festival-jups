(ns webbackend.events
  (:require
    [cljs.core.async :refer [<!]]
    [reagent.core :as r]
    [cljs-http.client :as http]
    [webbackend.prosemirror :refer [prosemirror]])
  (:require-macros [cljs.core.async :refer [go]]))

(def file (atom {:file nil}))
(def event-string "{\"error\":{\"error\":false,\"message\":\"\"},\"data\":[{\"id\":1,\"type\":\"Workshop\",\"titel\":\"Kuckucksflöte bauen\",\"untertitel\":\"mit Hanna Stoll\",\"ort\":\"Kammgarn\",\"zeitVon\":\"2018-09-08T14:00\",\"zeitBis\":\"2018-09-08T16:00\",\"priority\":1,\"bild\":\"/example.jpg\",\"logo\":\"/example.jpg\",\"text\":\"Jedes Kind baut sich eine Kuckucksflöte aus <b>Bambus</b> und verziert sie anschliessend.<br><br>Bei fünf- oder sechsjährigen Kindern ist die Mitwirkung eines Erwachsenen hilfreich.<br>Leitung: Hanna Stoll, Musikschule MKS, www.mksh.ch\",\"ausverkauft\":false,\"ausverkauftText\":\"Es gibt noch Stehplätze an der Abendkasse\",\"abAlter\":\"5+\",\"tuerOeffnung\":\"\",\"preis\":\"20.- / 15.-\"},{\"id\":2,\"type\":\"Workshop\",\"titel\":\"Graffiti\",\"untertitel\":\"mit Alice Marugg\",\"ort\":\"Cardinal\",\"zeitVon\":\"2018-09-08T14:00\",\"zeitBis\":\"2018-09-08T16:00\",\"priority\":2,\"bild\":\"/example.jpg\",\"logo\":\"/example.jpg\",\"text\":\"Graffiti: modern, bunt, knallig und einfach cool! Möchtest du selbst mal mit Spraydosen ein Bild gestalten? Du lernst die Technik vom Sprayen kennen und gestaltest deinen eigenen Schriftzug. Ein tolles Bild zum Nachhausenehmen ist dann deine Belohnung!<b>Zusätzlich 10.- für Materialkosten.</b>\",\"ausverkauft\":true,\"ausverkauftText\":\"Es gibt noch Stehplätze an der Abendkasse\",\"abAlter\":\"\",\"tuerOeffnung\":\"\",\"preis\":\"frei\"},{\"id\":3,\"type\":\"Veranstaltung\",\"titel\":\"Theater Sgaramusch: Knapp e Familie\",\"untertitel\":\"Stefan und Nora\",\"ort\":\"Kammgarn\",\"zeitVon\":\"2018-09-08T00:00\",\"zeitBis\":\"2018-09-08T00:00\",\"priority\":1,\"bild\":\"/example.jpg\",\"logo\":\"/example.jpg\",\"text\":\"\\\"Irgendöppis fählt.<br> Was?<br> Es Chind.\\\"<br> Wie wäre es, wenn man eins hätte?<br> Schön, lustig, streng, ernst?<br> Möchte man wirklich eins?<br> Eine Frau und ein Mann stellen sich vor, dass sie zusammen ein Kind hätten. Dabei entsteht ein ganzes Familienleben mit Geschrei, Ferien und was halt so dazu gehört.<br> Sgaramusch gibt den Zuschauerkindern die Gelegenheit, Erwachsene zu beobachten, wie sie über Kinder reden, wenn die Kinder nicht dabei sind.<br> Und sich einzumischen!<br> Mindestalter 7 Jahre.<br> www.sgaramusch.ch\",\"ausverkauft\":false,\"ausverkauftText\":\"Keine Plätze mehr\",\"abAlter\":\"5+\",\"tuerOeffnung\":\"15min vor Beginn\",\"preis\":\"20.- / 15.-\"}]}")
(defn parse-events [events]
  (js->clj (.parse js/JSON events) :keywordize-keys true))

(def events (r/atom (parse-events event-string)))

#_(go (let [response (<! (http/get "http://api.festival-jups.ch/events/"
                               {:with-credentials? false}))]
       (prn (:status response))
       (prn (:body response))
       (reset! events (:body response))))

(defn selected-cursor [selected]
  (r/cursor events [:data (.indexOf (map :id (:data @events)) selected)]))

(defn event-list[]
  [:ul (for [event (:data @events)]
          ^{:key (:id event)}
          [:li
           [:a {:style    {:cursor "pointer"}
                :on-click (fn [] (swap! events #(assoc % :selected (:id event))))}
            (:titel event)]])])

(defn update-event [key event]
  (fn [e] (swap! event #(assoc % key (-> e .-target .-value)))))

(defn field [type key name event]
  [:div
   [:label {:for (str key)} (str name ": ")]
   [:input {:type      type
            :name      (str key)
            :value     (key @event)
            :on-change (update-event key event)}]])

(defn checkbox [key name event]
  [:div
   [:label {:for (str key)} (str name ": ")]
   [:input {:type      "checkbox"
            :name      (str key)
            :checked   (key @event)
            :on-change (fn [e] (swap! event #(assoc % key (if (-> e .-target .-checked) true false))))}]])


(defn event-form [event]
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
    [prosemirror :text event]
    [checkbox :ausverkauft "Ausverkauft" event]
    [field "text" :ausverkauftText "Text Ausverkauft" event]
    [field "text" :abAlter "Mindestalter" event]
    [field "text" :tuerOeffnung "Türöffnung" event]
    [field "text" :preis "Preis" event]]
   [:button {:type     "submit"
             :on-click (fn [e]
                         (.preventDefault e))}
    "submit"]])

(defn events-form-success []
  (let [selected (:selected @events)]
    [:div {:style {:display        "flex"
                   :flex-direction "row"
                   :width "100%"
                   :height "100%"}}
     (event-list)
     (if selected
       (event-form (selected-cursor selected))
       [:p "Wähle einen Event"])]))

(defn events-form [event]
  (fn []
    (cond (:error (:error @events)) [:div [:p (:message (:error (@events)))]]
          :default (events-form-success))))


(defn random-form []
  (let [state (r/atom {:file nil})]
    (fn []
      [:div
       [:div
        [:div {:id "mirror" :style {:border "5px" :border-style "solid" :border-color "black"}}]]
       [:button
        {:on-click #(js/CodeMirror (js/document.getElementById "mirror" #js {:mode "htmlmixed"
                                                                                   :smartIndent true
                                                                                   :lineNumbers true}))}
        "edit"]
       [:div
        [:p "RANDOM"]
        [:input {:type      "file"
                 :on-change (fn [e]
                              (swap! file #(assoc
                                             %
                                             :file
                                             (.item (-> e .-target .-files) 0))))}]]
       #_[:div {:id "FILE"} (:file @state)]])))