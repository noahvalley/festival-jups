(ns webbackend.fields
  (:require [cljs-http.client :as http]
            [reagent.core :as r]
            [webbackend.requests :refer [upload-file delete-file]]))

(def label-style {:width "10%"})
(def input-style {:width "90%"})

(defn update-data [key event]
  (fn [e] (swap! event #(assoc % key (-> e .-target .-value)))))

(defn field [type key name data]
  [:div {:style {:display "flex"
                 :flex-direction "row"}}
   [:label {:for (str key)
            :style label-style}
    (str name ": ")]
   [:input {:type      type
            :name      (str key)
            :value     (key @data)
            :style input-style
            :on-change (update-data key data)}]])

(defn dropdown [selects key name data]
  [:div {:style {:display "flex"
                 :flex-direction "row"}}
   [:label {:for (str key)
            :style label-style}
    (str name ": ")]
   [:select {:name      (str key)
             :value (or (key @data) "")
             :style input-style
             :on-change (update-data key data)}
    (for [s selects]
      ^{:key s}
      [:option {:value s} s])]])

#_(defn dropdown-image [selects key name data]
  [:div {:style {:display        "flex"
                 :flex-direction "column"}}
   [dropdown selects key name data]
   (if (not (or
              (nil? (key @data))
              (= "" (key @data))))
     [:img {:src   (str "http://api.festival-jups.ch/images/" (key @data))
            :style {:align-self "center"
                    :max-width  "20%"
                    :object-fit "contain"}}])])

(defn year-url [global property-key year-key thing-key event-property?]
  (let [year (year-key @global)
        thing (thing-key @global)]
    (swap! global
           #(assoc-in %
                      (remove nil? [(if event-property? :event) property-key])
                      (if (= "" thing)
                        ""
                        (str year "/" thing))))))

(defn double-dropdown [global property-key list-key description event-property?]
  (let [years-keywords (keys (list-key @global))
        years (map cljs.core/name years-keywords)
        year-key (keyword (str "selected-year-" (name property-key)))
        thing-key (keyword (str "selected-" (name property-key)))]
    [:div {:style {:display        "flex"
                   :flex-direction "row"}}
     [:label {:for   (str year-key)
              :style label-style}
      (str description ": ")]
     [:div {:style input-style}
      [:select {:name      (str year-key)
                :value     (or (year-key @global) "")
                :on-change (fn [e]
                             (let [update-year (update-data year-key global)]
                               (swap! global #(assoc % thing-key ""))
                               (update-year e)
                               (year-url global property-key year-key thing-key event-property?)))}
       (for [s (cons "" years)]
         ^{:key s}
         [:option {:value s} s])]
      [:select
       {:value     (or (thing-key @global) "")
        :on-change (fn [e]
                     (let [update-thing (update-data thing-key global)]
                       (update-thing e)
                       (year-url global property-key year-key thing-key event-property?)))}
       (if (not (or (= "" (year-key @global))
                    (nil? (year-key @global))))
         (for [s (cons "" ((keyword (year-key @global)) (list-key @global)))]
           ^{:key s}
           [:option {:value s} s]))]]]))

(defn double-dropdown-image [global property-key list-key description]
  [:div {:style {:display        "flex"
                 :flex-direction "column"}}
   [double-dropdown global property-key list-key description true]
   (let [url-suffix (-> @global :event property-key)]
     (if (not (or (nil? url-suffix)
                  (= "" url-suffix)))
       [:img {:src   (str "http://api.festival-jups.ch/images/"
                          url-suffix)
              :style {:align-self "center"
                      :max-width  "20%"
                      :object-fit "contain"}}]))])

(defn checkbox [key name data]
  [:div {:style {:display "flex"
                 :flex-direction "row"
                 :justify-content "flex-start"}}
   [:label {:for (str key)
            :style label-style}
    (str name ": ")]
   [:input {:type      "checkbox"
            :name      (str key)
            :checked   (key @data)
            :on-change (fn [e] (swap! data
                                      #(assoc %
                                         key
                                         (if (-> e .-target .-checked) true false))))}]])

#_(defn delete-field-old [global name type file-list]
  (let [key :filename
        data (r/atom {:filename nil})]
    [:div {:style {:display "flex"
                   :flex-direction "row"
                   :justify-content "flex-start"
                   :max-width "90%"}}
     [dropdown @file-list key name data]
     [:button {:on-click #(delete-file global type (:filename @data) file-list)}
      "löschen"]]))

(defn delete-field [global type property-key list-key description event-property?]
  [:div {:style {:border-style "solid"
                 :border-color "black"
                 :display "flex"
                 :flex-direction "column"}}
   [double-dropdown global property-key list-key description event-property?]
   [:button {:style {:max-width "100px"}
             :on-click #(delete-file global type (property-key @global) list-key)}
    "löschen"]])

(defn upload-field [global description type file file-list]
  [:div {:style {:border-style "solid"
                 :border-color "black"
                 :display         "flex"
                 :flex-direction  "row"
                 :justify-content "flex-start"
                 :max-width       "90%"}}
   [:label {:for   type
            :style {:width "30%"}}
    (str description ": ")]
   [:input {:style     {:display        "flex"
                        :flex-direction "row"}
            :name      type
            :type      "file"
            :on-change (fn [e]
                         (reset! file
                                 (.item (-> e
                                            .-target
                                            .-files)
                                        0)))}]
   [:button
    {:on-click #(upload-file global type file file-list)}
    "upload"]])
