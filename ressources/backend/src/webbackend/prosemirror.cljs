(ns webbackend.prosemirror
  (:require [prosemirror-state :refer [EditorState]]
            [prosemirror-view :refer [EditorView]]
            [prosemirror-model :refer [Schema DOMParser DOMSerializer]]
            [prosemirror-schema-basic :refer [schema]]
            [prosemirror-schema-list :refer [addListNodes]]
            [prosemirror-example-setup :refer [exampleSetup]]
            [reagent.core :as r]))

(defonce mySchema
  (Schema.
    #js {"nodes" (addListNodes (-> prosemirror-schema-basic/schema .-spec .-nodes) "paragraph block*" "block")
         "marks" (-> prosemirror-schema-basic/schema .-spec .-marks)}))

(defn html->doc [key event]
  (-> DOMParser
      (.fromSchema mySchema)
      (.parse (doto (js/document.createElement "div")
                (#(set! (.-innerHTML %) (key event)))))))

(defonce current-view (atom {}))

(defn view [key event]
  (let [prosemirror-dom-node (doto
                               (js/document.createElement "div")
                               (.setAttribute "id" "prosemirror"))]
    (reset! current-view
            (EditorView.
              prosemirror-dom-node
              #js {
                   "state" (-> EditorState
                               (.create
                                 #js {"doc"     (html->doc key event)
                                      "plugins" (exampleSetup #js {"schema" mySchema})}))}))
    prosemirror-dom-node))

(defn content []
  (-> @current-view
      .-props
      .-state
      .-doc
      .-content))

(defn serialized-content []
  (-> DOMSerializer
      (.fromSchema mySchema)
      (.serializeFragment (content))))

(defn get-html-string []
  (-> (doto (js/document.createElement "div")
        (.appendChild (serialized-content)))
      .-innerHTML))

(defn prosemirror [key event]
  (r/create-class
    {:display-name         "prosemirror"
     :reagent-render       (fn [] [:div.ProseMirror])
     :component-did-mount  #(.appendChild (r/dom-node %) (view key event))
     :component-will-update #(.replaceChild
                               (r/dom-node %)
                               (view (second %2) (get %2 2))
                               (js/document.getElementById "prosemirror"))}))
