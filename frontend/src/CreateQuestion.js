"use client";
import { Editor } from '@monaco-editor/react';
import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from './hooks/use-mutation';
import { v4 as uuidv4 } from 'uuid';
import { isFormValid } from './utils/form-validation';
import { useNavigate, useParams } from 'react-router-dom';
import { Chat } from './Chat';

const CreateQuestion = () => {
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [lastCursorPosition, setLastCursorPosition] = useState(null);
  const textareaRef = useRef(null);

  const { id: userId } = useParams();
  const [question, setQuestion] = useState({
    id: uuidv4(),
    level: '',
    topics: [''],
    content: '',
    professorId: userId,
    codeSnippets: [{ lang: '', langSlug: '', code: '' }],
    testCases: { id: 0, input: '', expectedOutput: '' }
  });
  const [submitQuestion, { isLoading, error, data: result }] = useMutation("questions");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'content' && !drawerOpen) {
      const match = value.match(/@write\s*([^@]*)$/);
      if (match) {
        // Open drawer
        setDrawerOpen(true);
      }
    }

    setQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Listen for key combinations to open drawer
  useEffect(() => {
    // Close drawer with Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  const handleTopicChange = (index, value) => {
    const newTopics = [...question.topics];
    newTopics[index] = value;
    setQuestion(prev => ({ ...prev, topics: newTopics }));
  };

  const addTopic = () => {
    setQuestion(prev => ({
      ...prev,
      topics: [...prev.topics, '']
    }));
  };

  const removeTopic = (index) => {
    const newTopics = question.topics.filter((_, i) => i !== index);
    setQuestion(prev => ({ ...prev, topics: newTopics }));
  };

  const handleCodeSnippetChange = (index, field, value) => {
    const newCodeSnippets = [...question.codeSnippets];
    newCodeSnippets[index] = {
      ...newCodeSnippets[index],
      [field]: value
    };
    setQuestion(prev => ({ ...prev, codeSnippets: newCodeSnippets }));
  };

  const addCodeSnippet = () => {
    setQuestion(prev => ({
      ...prev,
      codeSnippets: [...prev.codeSnippets, { lang: '', langSlug: '', code: '' }]
    }));
  };

  const removeCodeSnippet = (index) => {
    const newCodeSnippets = question.codeSnippets.filter((_, i) => i !== index);
    setQuestion(prev => ({ ...prev, codeSnippets: newCodeSnippets }));
  };

  const handleTestCaseChange = (field, value) => {
    setQuestion(prev => ({
      ...prev,
      testCases: {
        ...prev.testCases,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitQuestion(question);
    } catch (error) {
      console.error(error);
    } finally {
      // route to the question details page
      navigate(`/questions/${question.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-md rounded-lg drawer drawer-end">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => setDrawerOpen(!drawerOpen)}
      />
      <div className="drawer-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="label">Difficulty Level</label>
              <select
                name="level"
                value={question.level}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="label text-lg">Question Content</legend>
              <textarea
                ref={textareaRef}
                name="content"
                className="textarea textarea-xl h-24 w-full"
                value={question.content}
                onChange={handleInputChange}
                placeholder="Enter question description"></textarea>
              <div className="text-xs text-gray-500 mt-1">
                Tip: Type @write to open AI assistant
              </div>
            </fieldset>
          </div>

          <div className="flex flex-row justify-between">
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={addTopic}
              >
                Add Topic
              </button>
            </div>
            {question.topics.map((topic, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  value={topic}
                  onChange={(e) => handleTopicChange(index, e.target.value)}
                  placeholder="Enter topic"
                  className="input input-bordered w-full"
                />
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="btn btn-circle btn-error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={addCodeSnippet}
              >
                Add code snippet
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              </button>
            </div>
            {question.codeSnippets.map((snippet, index) => (
              <div key={index} className="space-y-2 mb-4 p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="input input-bordered w-full"
                    type="text"
                    name="lang"
                    placeholder="Language Name"
                    value={snippet.lang}
                    onChange={(e) => handleCodeSnippetChange(index, 'lang', e.target.value)}
                  />
                  <input
                    className="input input-bordered w-full"
                    type="text"
                    name="langSlug"
                    value={snippet.langSlug}
                    onChange={(e) => handleCodeSnippetChange(index, 'langSlug', e.target.value)}
                    placeholder="Language Slug"
                  />
                </div>
                <div className="h-64">
                  <Editor
                    height="100%"
                    defaultLanguage='python'
                    language={snippet.langSlug || 'python'}
                    value={snippet.code}
                    onChange={(value) => handleCodeSnippetChange(index, 'code', value || '')}
                    options={{
                      minimap: { enabled: false }
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-error mt-2"
                  onClick={() => removeCodeSnippet(index)}
                >
                  Remove Snippet
                </button>
              </div>
            ))}
          </div>

          <div>
            <label className="label text-lg">Test Case</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Test Case Input</label>
                <input
                  name="input"
                  type="text"
                  placeholder="Enter text case input"
                  value={question.testCases.input}
                  onChange={(e) => handleTestCaseChange('input', e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">Expected Output</label>
                <input
                  name="expectedOutput"
                  type="text"
                  value={question.testCases.expectedOutput}
                  onChange={(e) => handleTestCaseChange('expectedOutput', e.target.value)}
                  placeholder="Enter expected output"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={!isFormValid(question) || isLoading}>
              Create Question
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="loading loading-infinity w-40"></div>
          </div>
        </div>
      )}
      {error && <div className="alert alert-error">{error}</div>}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        //onClick={() => setDrawerOpen(false)}
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-[50%] p-4 ">
          {/* Sidebar content here */}
          <Chat />
        </div>
      </div>
    </div>);
};

export default CreateQuestion;