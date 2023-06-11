package com.captsoneteamsingo.ui.informationmenu

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.captsoneteamsingo.databinding.FragmentInformationsBinding

class InformationsFragment : Fragment() {

    private var _binding: FragmentInformationsBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val informationsViewModel =
            ViewModelProvider(this).get(InformationtionsViewModel::class.java)

        _binding = FragmentInformationsBinding.inflate(inflater, container, false)
        val root: View = binding.root


        return root
    }

//    override fun onDestroyView() {
//        super.onDestroyView()
//        _binding = null
//    }
}