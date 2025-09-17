<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Form;
use App\Models\Submission;
use App\Models\SubmissionAnswer;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    public function index($formId){
        $form = Form::findOrFail($formId);
        return $form->submissions()->with('answers')->get();
    }

    // save a submission
    public function store(Request $request, $formId){
        $request->validate(['answers' => 'array']);
        $form = Form::with('fields.options')->findOrFail($formId);

        // Basic required validation:
        $answers = collect($request->answers)->keyBy('field_id');

        foreach ($form->fields as $field){
            if ($field->required){
                $a = $answers->get($field->id);
                if (!$a || $a['value'] === null || $a['value'] === '' || (is_array($a['value']) && empty($a['value']))){
                    return response()->json(['message'=>"Field '{$field->label}' is required."], 422);
                }
            }
            // For radio/checkbox validate value(s) are present in options (basic)
            if (in_array($field->type, ['radio','checkbox']) && $answers->has($field->id)){
                $val = $answers->get($field->id)['value'];
                $optionValues = $field->options->pluck('label')->toArray();
                if ($field->type === 'radio' && !in_array($val, $optionValues)) {
                    return response()->json(['message'=>"Invalid option for '{$field->label}'"], 422);
                }
                if ($field->type === 'checkbox') {
                    if (!is_array($val)) return response()->json(['message'=>"Invalid option list for '{$field->label}'"], 422);
                    foreach ($val as $v) if (!in_array($v, $optionValues)) {
                        return response()->json(['message'=>"Invalid option for '{$field->label}'"], 422);
                    }
                }
            }
        }

        $submission = Submission::create(['form_id'=>$form->id]);
        foreach ($request->answers as $ans){
            SubmissionAnswer::create([
                'submission_id' => $submission->id,
                'field_id' => $ans['field_id'],
                'value' => is_array($ans['value']) ? json_encode($ans['value']) : (string)$ans['value']
            ]);
        }
        return response()->json(['message'=>'Saved','submission_id'=>$submission->id], 201);
    }

    public function show($id){
        return Submission::with('answers.field')->findOrFail($id);
    }
}
