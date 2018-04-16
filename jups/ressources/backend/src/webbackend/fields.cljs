(ns webbackend.fields
  (:require [cljs-http.client :as http]
            [reagent.core :as r]
            [cljs.core.async :refer [go <!]]))

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

(defn dropdown-image [selects key name data]
  [:div {:style {:display        "flex"
                 :flex-direction "column"}}
   [dropdown selects key name data]
   (if (not (or
              (nil? (key @data))
              (= "" (key @data))))

       [:img {:src   (str "http://api.festival-jups.ch/image/" (key @data))
              :style {:align-self "center"
                      :max-width  "20%"
                      :object-fit "contain"}}])])

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
            :on-change (fn [e] (swap! data #(assoc % key (if (-> e .-target .-checked) true false))))}]])

(defn upload-file [type file session]
  (http/post (str "http://api.festival-jups.ch/" type)
             {:multipart-params  [["session" @session] ["file" @file]]
              :with-credentials? false}))

(defn delete-file [type name session]
  (http/delete (str "http://api.festival-jups.ch/" type "/" name)
               {:with-credentials? false
                :json-params {:session session}}))

(defn image-list [images]
  (go (let [response (<! (http/get "http://api.festival-jups.ch/image"
                                   {:with-credentials? false}))]
        (reset! images (-> response :body :data)))))

(defn upload-field [type file session images]
  [:div
   [:input {:style {:display "flex"
                    :flex-direction "row"}
            :type      "file"
            :on-change (fn [e]
                         (reset! file
                                 (.item (-> e
                                            .-target
                                            .-files)
                                        0)))}]
   [:button
    {:on-click #(go (let [response (<!(upload-file type file session))]
                      (image-list images)))}
    "upload"]])
