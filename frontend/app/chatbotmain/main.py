import streamlit as st
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from streamlit_chat import message
from langchain.chains import ConversationalRetrievalChain
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import LlamaCpp
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings, HuggingFaceInstructEmbeddings
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
import os
import tempfile




def initialize_session_state():
    if 'history' not in st.session_state:
        st.session_state['history'] = []

    if 'generated' not in st.session_state:
        st.session_state['generated'] = ["Hello! Ask me anything about "]

    if 'past' not in st.session_state:
        st.session_state['past'] = ["Hey!"]

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_vectorstore(text_chunks):
    embeddings = OpenAIEmbeddings()
    #embeddings = HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-xl")
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore


def process_pdf_documents(text):


    # get the text chunks
    text_chunks = get_text_chunks(text)

    # create vector store
    vectorstore = get_vectorstore(text_chunks)

    # create conversation chain
    chain = create_conversational_chain(vectorstore)
    return chain


def conversation_chat(query, chain, history):
    result = chain({"question": query, "chat_history": history})
    history.append((query, result["answer"]))
    return result["answer"]

def display_chat_history(chain):
    reply_container = st.container()
    container = st.container()

    with container:
        with st.form(key='my_form', clear_on_submit=True):
            user_input = st.text_input("Question:", placeholder="Ask anything about financial planning, budgeting, saving and more...", key='input')
            submit_button = st.form_submit_button(label='Send')

        if submit_button and user_input:
            with st.spinner('Generating response...'):
                output = conversation_chat(user_input, chain, st.session_state['history'])

            st.session_state['past'].append(user_input)
            st.session_state['generated'].append(output)

    if st.session_state['generated']:
        with reply_container:
            for i in range(len(st.session_state['generated'])):
                message(st.session_state["past"][i], is_user=True, key=str(i) + '_user', avatar_style="thumbs")
                message(st.session_state["generated"][i], key=str(i))

def create_conversational_chain(vector_store):
#     # Create llm
#     llm = LlamaCpp(
#     streaming = True,
#     model_path="mistral-7b-instruct-v0.1.Q4_K_M.gguf",
#     temperature=0.75,
#     top_p=1, 
#     verbose=True,
#     n_ctx=4096
# )
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    chain = ConversationalRetrievalChain.from_llm(llm=llm, chain_type='stuff',
                                                 retriever=vector_store.as_retriever(search_kwargs={"k": 2}),
                                                 memory=memory)
    return chain

def main():
    # Initialize session state
    initialize_session_state()
    st.title("Money Mentor ")
    st.subheader("_your personal finance & budgeting helper_")
    # Initialize Streamlit
    load_dotenv()
    pdf_docs = ['trainingPdf.pdf']  # Provide the paths to the PDF documents "path_to_pdf2.pdf"
    pdf_text = get_pdf_text(pdf_docs)
    chain = process_pdf_documents(pdf_text)

    
    display_chat_history(chain)

if __name__ == "__main__":
    main()