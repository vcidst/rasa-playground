
const defaultFlows = `flows:
  transfer_money:
    description: Help users send money to friends and family.
    steps:
      - collect: recipient
      - collect: amount
        description: the number of US dollars to send
      - action: utter_transfer_complete
  pattern_chitchat:
    description: Conversation repair flow for off-topic interactions that won't disrupt the main conversation. should not respond to greetings or anything else for which there is a flow defined
    name: pattern chitchat
    steps:
      - action: utter_free_chitchat_response
  pattern_search:
    description: Flow for handling knowledge-based questions
    name: pattern search
    steps:
      - action: utter_free_chitchat_response
`;

const defaultDomain = `version: "3.1"

slots:
  recipient:
    type: text
    mappings:
      - type: from_llm
  amount:
    type: float
    mappings:
      - type: from_llm

responses:
  utter_ask_recipient:
    - text: "Who would you like to send money to?"

  utter_ask_amount:
    - text: "How much money would you like to send?"

  utter_transfer_complete:
    - text: "All done. {amount} has been sent to {recipient}."

  utter_free_chitchat_response:
    - text: "placeholder"
      metadata:
        rephrase: True
        rephrase_prompt: |
          The following is a conversation with an AI assistant built with Rasa.
          The assistant can help the user transfer money.
          The assistant is helpful, creative, clever, and very friendly.
          The user is making small talk, and the assistant should respond, keeping things light.
          Context / previous conversation with the user:
          {{history}}
          {{current_input}}
          Suggested AI Response:`;
const defaultEndpoints = `# Allow rephrasing of responses using a Rasa-hosted model
nlg:
  type: rephrase
  llm:
    model_group: rasa_command_generation_model

model_groups:
  - id: rasa_command_generation_model
    models:
      - provider: rasa
        model: rasa/cmd_gen_codellama_13b_calm_demo
        api_base: "https://tutorial-llm.rasa.ai"`;
const defaultConfig = `recipe: default.v1
language: en
pipeline:
- name: SingleStepLLMCommandGenerator
  llm:
    model_group: rasa_command_generation_model
  flow_retrieval:
    active: false

policies:
  - name: FlowPolicy
#  - name: EnterpriseSearchPolicy`;

export const defaultValues = {
  flows: defaultFlows,
  domain: defaultDomain,
  endpoints: defaultEndpoints,
  config: defaultConfig,
};
