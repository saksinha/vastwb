import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from 'lucide-react';

const defaultSuggestions = ['url', 'vpmute', 'plcmt', 'wta', 'gdpr', 'addtl_consent', 'gdpr_consent', 'max_ad_duration', 'min_ad_duration', 'cust_params', 'rdid', 'idtype', 'an', 'msid'];

const escapeMap = {
  '%': '%25',
  ' ': '%20',
  '&': '%26',
  '+': '%2B',
  '=': '%3D',
  '#': '%23',
  '/': '%2F',
  '?': '%3F'
};

const URLParserGenerator = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [params, setParams] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [unselectedParams, setUnselectedParams] = useState([]);
  const [customParam, setCustomParam] = useState({ key: '', value: '' });
  const [suggestions, setSuggestions] = useState(defaultSuggestions);

  const parseUrl = () => {
    const [baseUrl, queryString] = inputUrl.split('?');
    const urlParams = new URLSearchParams(queryString);
    const parsedParams = Array.from(urlParams.entries()).map(([key, value]) => ({ key, value, selected: true, original: true }));
    setParams(parsedParams);
    updateSuggestions(parsedParams);
  };

  const updateSuggestions = (currentParams) => {
    const currentKeys = currentParams.map(param => param.key);
    setSuggestions(defaultSuggestions.filter(suggestion => !currentKeys.includes(suggestion)));
  };

  const handleParamChange = (index, field, value) => {
    const updatedParams = [...params];
    updatedParams[index][field] = value;
    setParams(updatedParams);
  };

  const toggleParamSelection = (index) => {
    const updatedParams = [...params];
    updatedParams[index].selected = !updatedParams[index].selected;
    setParams(updatedParams);
  };

  const addCustomParam = () => {
    if (customParam.key && customParam.value) {
      setParams([...params, { ...customParam, selected: true, original: false }]);
      setCustomParam({ key: '', value: '' });
      updateSuggestions([...params, customParam]);
    }
  };

  const removeParam = (index) => {
    const updatedParams = params.filter((_, i) => i !== index);
    setParams(updatedParams);
    updateSuggestions(updatedParams);
  };

  const escapeValue = (value) => {
    return value.replace(/[%& +=#/?]/g, match => escapeMap[match]);
  };

  const generateNewUrl = () => {
    const [baseUrl] = inputUrl.split('?');
    const selectedParams = params.filter(param => param.selected);
    const queryString = selectedParams
      .map(param => `${param.key}=${escapeValue(param.value)}`)
      .join('&');
    const generatedUrl = `${baseUrl}?${queryString}`;
    setNewUrl(generatedUrl);

    const unselected = params
      .filter(param => !param.selected && param.original)
      .map(param => param.key);
    setUnselectedParams(unselected);
  };

  const addSuggestion = (suggestion) => {
    setParams([...params, { key: suggestion, value: '', selected: true, original: false }]);
    updateSuggestions([...params, { key: suggestion, value: '' }]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">URL Parser and Generator</h1>
      <div className="mb-4">
        <Input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full mb-2"
        />
        <Button onClick={parseUrl}>Parse URL</Button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Parameters</h2>
        {params.map((param, index) => (
          <div key={index} className="flex items-center mb-2">
            <Input
              type="text"
              value={param.key}
              onChange={(e) => handleParamChange(index, 'key', e.target.value)}
              className="w-1/3 mr-2"
            />
            <Input
              type="text"
              value={param.value}
              onChange={(e) => handleParamChange(index, 'value', e.target.value)}
              className="w-1/3 mr-2"
            />
            <Checkbox
              checked={param.selected}
              onCheckedChange={() => toggleParamSelection(index)}
              className="mr-2"
            />
            <Button onClick={() => removeParam(index)} variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Add Custom Parameter</h2>
        <div className="flex items-center">
          <Input
            type="text"
            value={customParam.key}
            onChange={(e) => setCustomParam({ ...customParam, key: e.target.value })}
            placeholder="Key"
            className="w-1/3 mr-2"
          />
          <Input
            type="text"
            value={customParam.value}
            onChange={(e) => setCustomParam({ ...customParam, value: e.target.value })}
            placeholder="Value"
            className="w-1/3 mr-2"
          />
          <Button onClick={addCustomParam}>Add</Button>
        </div>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Suggestions</h2>
        <div className="flex flex-wrap">
          {suggestions.map((suggestion) => (
            <Button key={suggestion} onClick={() => addSuggestion(suggestion)} className="mr-2 mb-2">
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <Button onClick={generateNewUrl}>Generate New URL</Button>
      </div>
      
      {newUrl && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Generated URL</h2>
          <p className="break-all">{newUrl}</p>
        </div>
      )}
      
      {unselectedParams.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Unselected Original Parameters</h2>
          <ul className="list-disc list-inside">
            {unselectedParams.map((param) => (
              <li key={param} className="text-red-500">{param}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default URLParserGenerator;
