(ns backend.events.prosemirror
  (:require ["prosemirror-state" :refer [EditorState]]
            ["prosemirror-view" :refer [EditorView]]
            ["prosemirror-model" :refer [Schema DOMParser DOMSerializer]]
            ["prosemirror-schema-basic" :as basic :refer [schema]]
            ["prosemirror-schema-list" :refer [addListNodes]]
            ["prosemirror-example-setup" :refer [exampleSetup]]
            [reagent.core :as r]))

(defonce mySchema
  (Schema.
    #js {"nodes" (addListNodes (-> basic/schema .-spec .-nodes) "paragraph block*" "block")
         "marks" (-> basic/schema .-spec .-marks)}))

(defn html->doc [content]
  (-> DOMParser
      (.fromSchema mySchema)
      (.parse (doto (js/document.createElement "div")
                (#(set! (.-innerHTML %) content))))))

(defonce current-view (atom {}))

(defn view [content]
  (let [prosemirror-dom-node (doto
                               (js/document.createElement "div")
                               (.setAttribute "id" "prosemirror"))]
    (reset! current-view
            (EditorView.
              prosemirror-dom-node
              #js {
                   "state" (-> EditorState
                               (.create
                                 #js {"doc"     (html->doc content)
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

(defn prosemirror [content]
  (r/create-class
    {:display-name         "prosemirror"
     :reagent-render       (fn [] [:div.ProseMirror])
     :component-did-mount  #(.appendChild (r/dom-node %) (view content))
     :component-will-update #(.replaceChild
                               (r/dom-node %)
                               (view (second %2))
                               (js/document.getElementById "prosemirror"))}))
